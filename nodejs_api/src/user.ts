export class User{
    readonly id;
    readonly name;
    readonly email;
    readonly user;
    readonly password;

    constructor({
        id,
        name,
        email,
        user,
        password,
    }: {
        id?: number | undefined,
        name: string,
        email: string,
        user: string,
        password?: string | undefined,
    }) {
        this.id = id;
        this.name = name.trim();
        this.email = email.trim();
        this.user = user.trim();
        this.password = password?.trim();
    }
}
