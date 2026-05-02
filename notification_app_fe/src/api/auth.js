import { Log, setLogToken } from "../logging_middleware/logger";

export const getToken = async () => {
    try {
        const res = await fetch("/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: "bg0502@srmist.edu.in",
            name: "Balaji G",
            rollNo: "RA2311003012188",
            accessCode: "QkbpxH",
            clientID: "2f7aaf1d-bb45-4ecc-91c6-cfe1eee796eb",
            clientSecret: "xcgkeyTMRKYqYtYy",
        }),
    });

    const data = await res.json();

    if (!res.ok || !data.access_token) {
        throw new Error("Authentication failed");
    }

    setLogToken(data.access_token);
    await Log("frontend", "info", "api", "Authentication token generated");

    return data.access_token;
    } catch (err) {
        await Log("frontend", "error", "api", "Authentication request failed");
        throw err;
    }
};
