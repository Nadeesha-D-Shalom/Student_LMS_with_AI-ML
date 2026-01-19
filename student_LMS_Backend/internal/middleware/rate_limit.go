package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type clientBucket struct {
	tokens     int
	lastRefill time.Time
}

type RateLimiter struct {
	mu       sync.Mutex
	buckets  map[string]*clientBucket
	capacity int
	refill   time.Duration
}

func NewRateLimiter(capacity int, refill time.Duration) *RateLimiter {
	return &RateLimiter{
		buckets:  make(map[string]*clientBucket),
		capacity: capacity,
		refill:   refill,
	}
}

func (rl *RateLimiter) allow(key string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	b, ok := rl.buckets[key]
	if !ok {
		rl.buckets[key] = &clientBucket{
			tokens:     rl.capacity - 1,
			lastRefill: time.Now(),
		}
		return true
	}

	now := time.Now()
	elapsed := now.Sub(b.lastRefill)

	if elapsed >= rl.refill {
		b.tokens = rl.capacity
		b.lastRefill = now
	}

	if b.tokens <= 0 {
		return false
	}

	b.tokens--
	return true
}

func RateLimitMiddleware(rl *RateLimiter, keyFunc func(*gin.Context) string) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := keyFunc(c)
		if key == "" {
			key = c.ClientIP()
		}

		if !rl.allow(key) {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "too many requests"})
			c.Abort()
			return
		}

		c.Next()
	}
}
