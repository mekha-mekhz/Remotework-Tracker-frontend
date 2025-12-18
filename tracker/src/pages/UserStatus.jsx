import React, { useState, useEffect } from "react";
import api from "../components/api";

function UserStatus() {
    const [status, setStatus] = useState("available");

    useEffect(() => {
        // Get current status on load
        api.get("/status")
            .then(res => setStatus(res.data.status))
            .catch(console.error);
    }, []);

    const changeStatus = async (newStatus) => {
        try {
            await api.put("/status", { status: newStatus });
            setStatus(newStatus);
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span>Status:</span>
            <select
                value={status}
                onChange={(e) => changeStatus(e.target.value)}
                className="p-2 rounded bg-gray-800 text-white"
            >
                <option value="available">Available 🟢</option>
                <option value="busy">Busy 🔴</option>
                <option value="invisible">Invisible ⚪</option>
                <option value="dnd">DND 🟠</option>
            </select>
        </div>
    );
}

export default UserStatus;
