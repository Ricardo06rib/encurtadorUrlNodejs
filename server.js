import express from 'express'

import crypto from 'crypto'
import pkg from './generated/prisma/index.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const app = express()

app.use(express.json())

app.get("/", (req, res) => {
        app.send("Rodando")
})

app.post("/shortUrl", async (req, res) => {
        const {longURL} = req.body
        if (!longURL) {
                return res.status(404).json({error: "URL is required"})
        }
        const shortId = crypto.randomBytes(3).toString("hex")
        try {
                const newUrl = await prisma.url.create({
                data: {
                        longUrl,
                        shortUrl: shortId,
                    },
                })

                res.json({ shortUrl: `http://localhost:8080/${newUrl.shortUrl}` })
        }catch(err){
                res.status(500).json({err: "Error save Url"})
        }
})

app.get("/:shortUrl", async (req,res) => {
        const {shortUrl} = req.params

        try{
                const url = await prisma.url.findUnique({
                        where: {shortUrl}
                })
                if (!url){
                        return res.status(400).json({error: "URL not found!"})
                }
                res.redirect(url.longUrl)
                
        }catch(err){
                res.status(500).json({error: "Url failed search"})
        }
})

app.listen(8080, () => {
        console.log("Server runnig on http://localhost:8080")
})