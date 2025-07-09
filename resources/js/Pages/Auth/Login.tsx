import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { CircleDollarSign } from "lucide-react";

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign in" />
            <div className={cn("flex flex-col gap-6")}>
                <Card className="overflow-hidden p-0">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <form className="p-6 md:p-8 flex-1" onSubmit={submit}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-400 shadow-lg">
                                        <CircleDollarSign className="h-6 w-6 text-white drop-shadow-md absolute transform -translate-y-[1px]" />
                                        <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-[1px] opacity-20"></div>
                                    </div>
                                    <h1 className="text-2xl font-bold">Welcome back</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your account
                                    </p>
                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                        id="email"
                        type="email"
                                        placeholder="m@example.com"
                        value={data.email}
                                        onChange={e => setData("email", e.target.value)}
                                        required
                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                </div>
                                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                                        onChange={e => setData("password", e.target.value)}
                                        required
                    />
                                    <InputError message={errors.password} />
                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="remember"
                            name="remember"
                                        type="checkbox"
                            checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                        />
                                    <Label htmlFor="remember" className="text-sm text-gray-600 select-none cursor-pointer">
                            Remember me
                                    </Label>
                                </div>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    Login
                                </Button>
                            </div>
                        </form>
                        <div className="bg-muted relative hidden md:block">
                            <img
                                src="/green.png"
                                alt="Green abstract background"
                                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            />
                        </div>
                    </CardContent>
                </Card>
                <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                    By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                    and <a href="#">Privacy Policy</a>.
                </div>
                </div>
        </GuestLayout>
    );
}
