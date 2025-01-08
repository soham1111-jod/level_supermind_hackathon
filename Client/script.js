document.getElementById("onClik").addEventListener("click", async () => {
    const inputValue = document.getElementById("name").value;

    if (!inputValue.trim()) {
        alert("Please enter a message!");
        return;
    }

    const responseText = document.getElementById("chat");
    responseText.textContent = "Processing...";

    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputValue: inputValue })
        });

        if (!response.ok) {
            throw new Error("Failed to fetch response from server.");
        }

        const data = await response.json();
        if (data.output) {
            responseText.textContent = data.output;
        } else {
            responseText.textContent = "No response received.";
        }
    } catch (error) {
        console.error("Error:", error);
        responseText.textContent = "Error communicating with server.";
    }
});