import 'dotenv/config';
import { auth, prisma } from "@/lib/auth/auth";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const name = `${firstName ?? ""} ${lastName ?? ""}`.trim() || normalizedEmail;

    const signUpResult = await auth.api.signUpEmail({
      body: {
        email: normalizedEmail,
        password: String(password),
        name,
        firstname_th: firstName,
        lastname_th: lastName,
        firstname_en: firstName,
        lastname_en: lastName,
        iamId: '',
      },
      headers: request.headers,
    });

    const userId = signUpResult?.user?.id;
    if (!userId) {
      return Response.json({ error: "Failed to create user" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstname_th: firstName,
        lastname_th: lastName,
        email: normalizedEmail,
        name,
      },
    });

    return Response.json({ message: "User created successfully", user }, { status: 201 });
  } catch (error) {
    console.log(error);

    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}

