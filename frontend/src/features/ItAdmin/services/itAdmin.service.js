export const lockSystem = async (reason) => {
  console.log("LOCK SYSTEM:", reason);

  // Example API call
  // return api.post("/it-admin/system/lock", { reason });

  return { success: true };
};

export const unlockSystem = async (reason) => {
  console.log("UNLOCK SYSTEM:", reason);

  // return api.post("/it-admin/system/unlock", { reason });

  return { success: true };
};
