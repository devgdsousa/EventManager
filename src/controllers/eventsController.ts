import { Request, Response } from "express";
import prisma from "../../prisma/db";

export class EventsController {

    public async getEvents(req: Request, res: Response) {
        const events = await prisma.event.findMany({});
        return res.json(events);
    };

    public async createEvent(req: Request, res: Response) {
        const { title, description, imgURL, date, location, status } = req.body;

        // Verifica se o status fornecido é válido
        if (!['EM_BREVE', 'EM_ANDAMENTO', 'ENCERRADO'].includes(status)) {
            return res.status(400).json({ error: "Status inválido. Use 'EM_BREVE', 'EM_ANDAMENTO' ou 'ENCERRADO'." });
        }

        // Obtém o ID do usuário autenticado do response.locals
        const createdById = res.locals.userId;

        // Verifica se o ID do usuário existe
        const userExists = await prisma.user.findUnique({
            where: { id: createdById },
        });

        if (!userExists) {
            return res.status(400).json({ error: "Usuário não encontrado." });
        }

        const existingEvent = await prisma.event.findFirst({
            where: { title: title },
        });

        if (existingEvent) {
            return res.status(400).send("Evento já existe!");
        }

        try {
            const event = await prisma.event.create({
                data: {
                    title,
                    description,
                    imgURL,
                    date,
                    location,
                    status: status as 'EM_BREVE' | 'EM_ANDAMENTO' | 'ENCERRADO', // Cast para EventStatus
                    createdBy: {
                        connect: { id: createdById }, // Conecta o evento ao usuário
                    },
                },
            });
            return res.json(event);
        } catch (error) {
            console.error(error); // Log do erro para depuração
            return res.status(500).send("Erro ao criar Evento.");
        }
    }

    public async getEventById(req: Request, res: Response) {
        const { id } = req.params;
        const event = await prisma.event.findUnique({ where: { id: Number(id) } });
        if (!event) {
            return res.status(404).json({ error: "Evento não encontrado." });
        }
        return res.json(event);
    };

    public async updateEvent(req: Request, res: Response) {
        const { id } = req.params;
        const { title, description, imgURL, date, location, status } = req.body;

        // Verificar se o status fornecido é válido
        if (status && !['EM_BREVE', 'EM_ANDAMENTO', 'ENCERRADO'].includes(status)) {
            return res.status(400).json({ error: "Status inválido. Use 'EM_BREVE', 'EM_ANDAMENTO' ou 'ENCERRADO'." });
        }

        try {
            const event = await prisma.event.update({
                where: { id: Number(id) },
                data: {
                    title,
                    description,
                    imgURL,
                    date,
                    location,
                    status: status ? status as 'EM_BREVE' | 'EM_ANDAMENTO' | 'ENCERRADO' : undefined, // Cast para EventStatus
                },
            });
            return res.json(event);
        } catch (error) {
            return res.status(500).send("Erro ao atualizar Evento.");
        }
    };

    public async deleteEvent(req: Request, res: Response) {
        const { id } = req.params;
        await prisma.event.delete({ where: { id: Number(id) } });
        return res.send("Evento deletado!");
    };
}
