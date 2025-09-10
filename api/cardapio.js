const admin = require('firebase-admin');

// Lê a chave secreta da variável de ambiente da Vercel
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

// Esta é a função que a Vercel vai executar
export default async function handler(req, res) {
    // Permite que qualquer site aceda a esta API (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

    try {
        const snapshot = await db.collection('cardapio').get();
        const cardapioList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Envia a resposta de sucesso
        res.status(200).json(cardapioList);
    } catch (error) {
        console.error("Erro na API: ", error);
        res.status(500).json({ error: "Erro ao buscar dados do cardápio" });
    }
}