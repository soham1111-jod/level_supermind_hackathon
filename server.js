const express = require('express');
const app = express();
const port = 5500;
require('dotenv').config();
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const applicationToken = process.env.ASTRA_TOKEN;
app.use(cors());
// app.use(express.static(path.join(__dirname, 'Public')));
// app.use(express.static(path.join(__dirname, 'Client')));
app.use(express.json());


// app.get('/gedata', (req, res) => {
//     res.send('Hello from the server!');
//     console.log("hello from the server");
// });

app.post('/chat', async (req, res) => {
    console.log('POST /chat route triggered');
    const { inputValue, inputType = 'chat', outputType = 'chat', stream = false } = req.body;

    try {
        const langflowClient = new LangflowClient('https://api.langflow.astra.datastax.com', applicationToken);
        const response = await langflowClient.runFlow(
            'ba1aad5c-b677-481d-b406-37bf357ffdfc', // flowIdOrName
            'f353bef1-8545-410e-a327-3f6aafe01173', // langflowId
            inputValue,
            inputType,
            outputType,
            {}, // tweaks
            stream,
            (data) => console.log("Stream Update:", data),
            (message) => console.log("Stream Closed:", message),
            (error) => console.log("Stream Error:", error)
        );
        if (!stream && response && response.outputs) {
            const output = response.outputs[0].outputs[0].outputs.message.message.text;
            return res.json({ output });
        } else {
            res.json({ message: 'Stream started, check logs for updates.' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});





class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(endpoint, body, headers = {"Content-Type": "application/json"}) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        headers["Content-Type"] = "application/json";
        const url = `${this.baseURL}${endpoint}`;
        try {
            const response = await axios.post(url, body, { headers });
            return response.data;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }

    handleStream(streamUrl, onUpdate, onClose, onError) {
        const eventSource = new EventSource(streamUrl);

        eventSource.onmessage = event => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };

        eventSource.onerror = event => {
            console.error('Stream Error:', event);
            onError(event);
            eventSource.close();
        };

        eventSource.addEventListener("close", () => {
            onClose('Stream closed');
            eventSource.close();
        });

        return eventSource;
    }

    async runFlow(flowIdOrName, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
        try {
            const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream, tweaks);
            console.log('Init Response:', initResponse);
            if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
                const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
                console.log(`Streaming from: ${streamUrl}`);
                this.handleStream(streamUrl, onUpdate, onClose, onError);
            }
            return initResponse;
        } catch (error) {
            console.error('Error running flow:', error);
            onError('Error initiating session');
        }
    }
}

async function main(inputValue, inputType = 'chat', outputType = 'chat', stream = false) {
    const flowIdOrName = 'ba1aad5c-b677-481d-b406-37bf357ffdfc';
    const langflowId = 'f353bef1-8545-410e-a327-3f6aafe01173';
    const applicationToken = "AstraCS:ycimxlZEPkxBWPzElTnWjiot:63f9e76e8ad901af6fbc855a064b050219812a4ce8b4aafa897d80ab54fe5675";
    const langflowClient = new LangflowClient('https://api.langflow.astra.datastax.com', applicationToken);

    try {
        const tweaks = {
            "ChatInput-4XeFf": {},
            "ParseData-KZGGv": {},
            "Prompt-akU3u": {},
            "ChatOutput-Ls4bT": {},
            "GoogleGenerativeAIModel-2dyYt": {},
            "AstraDBToolComponent-YhTgy": {},
            "File-sU8kW": {}
        };
        const response = await langflowClient.runFlow(
            flowIdOrName,
            langflowId,
            inputValue,
            inputType,
            outputType,
            tweaks,
            stream,
            (data) => console.log("Received:", data.chunk), // onUpdate
            (message) => console.log("Stream Closed:", message), // onClose
            (error) => console.log("Stream Error:", error) // onError
        );
        if (!stream && response && response.outputs) {
            const flowOutputs = response.outputs[0];
            const firstComponentOutputs = flowOutputs.outputs[0];
            const output = firstComponentOutputs.outputs.message;

            console.log("Final Output:", output.message.text);
        }
    } catch (error) {
        console.error('Main Error', error.message);
    }
}

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error('Please run the file with the message as an argument: node <YOUR_FILE_NAME>.js "user_message"');
}
main(
    args[0], // inputValue
    args[1], // inputType
    args[2], // outputType
    args[3] === 'true' // stream
);