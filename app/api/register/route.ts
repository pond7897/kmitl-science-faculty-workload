import 'dotenv/config'
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}?schema=public`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const hashPassword = await Bun.password.hash(password, {
      algorithm: 'bcrypt'
    })

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        name
      }
    })

    return Response.json({ message: 'User created successfully', user }, { status: 201 });
  } catch (error) {
    console.log(error);

    return Response.json({ error: 'Failed to create user' });
  }
}

