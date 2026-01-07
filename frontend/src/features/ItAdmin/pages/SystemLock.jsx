import React, { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import { lockSystem, unlockSystem } from "../services/itAdmin.service";

const SystemLock = () => {
  const [systemLocked, setSystemLocked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);

  const openLockModal = () => {
    setAction("lock");
    setReason("");
    setModalOpen(true);
  };

  const openUnlockModal = () => {
    setAction("unlock");
    setReason("");
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    setLoading(true);

    try {
      if (action === "lock") {
        await lockSystem(reason);
        setSystemLocked(true);
      } else {
        await unlockSystem(reason);
        setSystemLocked(false);
      }
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Status Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              System Lock Control
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Lock or unlock the entire LMS platform.
            </p>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
              systemLocked
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {systemLocked ? "System Locked" : "System Online"}
          </span>
        </div>

        <div className="mt-6 flex gap-3">
          {!systemLocked ? (
            <button
              onClick={openLockModal}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
            >
              Lock System
            </button>
          ) : (
            <button
              onClick={openUnlockModal}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Unlock System
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          What happens when system is locked?
        </h3>
        <ul className="mt-3 list-disc list-inside text-sm text-slate-600 space-y-1">
          <li>Students cannot access dashboards or content</li>
          <li>Teachers cannot create or modify data</li>
          <li>Admins retain access</li>
          <li>Audit logs are recorded</li>
        </ul>
      </div>

      {/* Modal */}
      <ConfirmModal
        open={modalOpen}
        title={action === "lock" ? "Lock System" : "Unlock System"}
        description={
          action === "lock"
            ? "This will block access for all non-admin users."
            : "This will restore access to all users."
        }
        confirmText={action === "lock" ? "Lock Now" : "Unlock Now"}
        danger={action === "lock"}
        reason={reason}
        setReason={setReason}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />

      {loading && (
        <div className="text-sm text-slate-500">
          Applying system changes...
        </div>
      )}
    </div>
  );
};

export default SystemLock;
