const LOG_API = "http://20.207.122.201/evaluation-service/logs";
let authToken = "";

export const setLogToken = (token) => {
  authToken = token || "";
};

export const Log = async (stack, level, pkg, message) => {
  if (!authToken) {
    return { skipped: true, reason: "Missing auth token" };
  }

  try {
    const res = await fetch(LOG_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    return await res.json();
  } catch (err) {
    return null;
  }
};
