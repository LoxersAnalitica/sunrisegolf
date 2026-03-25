import crypto from 'crypto';

// Función auxiliar para hashear datos (requerimiento de Meta CAPI)
const hashData = (data) => {
    if (!data) return '';
    return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
};

export default async function handler(req, res) {
    // CORS Headers just in case (though Vercel handles same-origin cleanly)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const data = req.body; // Vercel ya parsea el JSON del body

        // --- 1. Preparar Payload para Kommo CRM ---
        const kommoPayload = [
            {
                "name": "Lead Sunrise Golf - " + data.name,
                "status_id": 103170707,
                "pipeline_id": 13375851,
                "_embedded": {
                    "tags": [
                        { "name": "Sunrise Golf" }
                    ],
                    "contacts": [
                        {
                            "name": data.name,
                            "custom_fields_values": [
                                { "field_code": "EMAIL", "values": [{ "value": data.email }] },
                                { "field_code": "PHONE", "values": [{ "value": data.phone || "Not provided" }] }
                            ]
                        }
                    ]
                }
            }
        ];

        const kommoPromise = fetch('https://lgamarra.kommo.com/api/v4/leads/complex', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImRhMjE3MDYyNTcwMzg2NDZhODc4YzBlOGY3YTRlZmUwZDI4NjIxMjQwNGMwODA0YzBlNTY4NDQwYmU3ZWUwNWZmMTZiOGVjZGViNzNlY2FkIn0.eyJhdWQiOiI5ZDcyOWNkMS02NTIzLTQ3ZTUtOWMxMy02YTI5YmYxYjI5YjYiLCJqdGkiOiJkYTIxNzA2MjU3MDM4NjQ2YTg3OGMwZThmN2E0ZWZlMGQyODYyMTI0MDRjMDgwNGMwZTU2ODQ0MGJlN2VlMDVmZjE2YjhlY2RlYjczZWNhZCIsImlhdCI6MTc3Mzk0MTc1OCwibmJmIjoxNzczOTQxNzU4LCJleHAiOjE4OTYwNDgwMDAsInN1YiI6IjE0OTgyMDAzIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM2MjI5MTMxLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZGRmZjgwZDMtNzk2ZC00NjBjLTg3ODQtMTdlNjY5NGUxOTFmIiwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.FU0VNQuzwOpLFuVK6ypJzg3YgFSyAqqQ_GU9ac6pn0KMbqwh2IGj1SfQ_lu1BtTVs9EkwdbBbjL6uTJM32AApU-cHcT3vwijT4zPYSPFs1e6N9RZQPAs25dn78_yNw-HwYYV5dz6KtMl7sJidQiL3gxhRf-KuFqVOpzBFaoK4oHtj2CVjKtd4FhlkoBsAIwBxIHeGHPT9rziZWUGDtVhvYSAU2pt4-Y3ioCD2gXSqDH3Xw4e0Fab6yeV0JLkgso9hH6itbobvVXUmY-FVdaqLj7xZbFD1Z5lwONWkingOYrBJ0xX8wDQg0gl2DDZ-_LLbU94SB3hKOUOpb1h14qdxw`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(kommoPayload)
        });

        // --- 2. Preparar Payload para Meta CAPI ---
        const eventId = crypto.randomUUID();
        const currentTimestamp = Math.floor(Date.now() / 1000);

        const metaPayload = {
            "data": [
                {
                    "event_name": "Lead",
                    "event_time": currentTimestamp,
                    "action_source": "website",
                    "event_id": eventId,
                    "user_data": {
                        "em": [hashData(data.email)],
                        "ph": [hashData(data.phone.replace(/[^0-9]/g, ''))] // Extraemos solo los números para el hash del teléfono
                    }
                }
            ]
        };

        const metaPromise = fetch('https://graph.facebook.com/v19.0/2463715127334679/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer EAAM87XgzXQsBQypNcFU41kQitsANL80ah1uFZC5EjvgUDgwv3EttVpq9UkUd7eZAiSiRLInrgRJVS3HTPznrlGfKnoZB1ZBTP8FRPL3zt8GakkOsRO2FzCpdptZA9xgnXUn10c8Dk56KdZA6GXvwiFJV54Rr4t7KIshLSr6QqZBencWyjYM2xBw930Ilw4x5dB6xwZDZD`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(metaPayload)
        });

        // 3. Ejecutar peticiones en paralelo. 
        const [kommoResponse] = await Promise.all([
            kommoPromise,
            metaPromise.catch(err => { console.error("Meta CAPI Warning (non-fatal):", err); return null; })
        ]);

        if (kommoResponse.ok || kommoResponse.status === 200 || kommoResponse.status === 201) {
            return res.status(200).json({ success: true });
        } else {
            const errText = await kommoResponse.text();
            console.error("Kommo API Error:", errText);
            return res.status(kommoResponse.status).json({ error: 'Error del servidor CRM externo', details: errText });
        }
    } catch (err) {
        console.error("Local Server/Vercel Error:", err);
        return res.status(500).json({ error: 'Error interno del servidor dev' });
    }
}
