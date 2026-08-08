import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Home, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AnimatedBadge } from "@/components/motion/animated-badge";

export const Route = createFileRoute("/$")({
	component: NotFoundPage,
});

function NotFoundPage() {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
			<motion.div
				className="absolute size-125 rounded-full bg-primary/10 blur-3xl"
				animate={{
					scale: [1, 1.15, 1],
					opacity: [0.4, 0.7, 0.4],
				}}
				transition={{
					duration: 6,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			<Card className="relative z-10 w-full max-w-lg border-border/50 bg-card/70 shadow-2xl backdrop-blur-xl">
				<CardContent className="flex flex-col items-center px-8 py-12 text-center">
					<motion.div
						initial={{
							opacity: 0,
							scale: 0.5,
						}}
						animate={{
							opacity: 1,
							scale: 1,
						}}
						transition={{
							type: "spring",
							stiffness: 180,
							damping: 12,
						}}
						className="relative mb-8"
					>
						<motion.div
							animate={{
								rotate: 360,
							}}
							transition={{
								duration: 12,
								repeat: Infinity,
								ease: "linear",
							}}
							className="absolute inset-0 rounded-full border border-dashed border-primary/30"
						/>

						<div className="rounded-full bg-muted p-5">
							<SearchX className="size-12 text-muted-foreground" />
						</div>
					</motion.div>

					<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
						<AnimatedBadge status="info">HTTP 404</AnimatedBadge>
					</motion.div>

					<motion.h1
						initial={{
							opacity: 0,
							y: 20,
						}}
						animate={{
							opacity: 1,
							y: 0,
						}}
						transition={{
							delay: 0.15,
						}}
						className="mt-6 bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-[120px] font-black leading-none tracking-tighter text-transparent"
					>
						404
					</motion.h1>

					<motion.div
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
						transition={{
							delay: 0.3,
						}}
					>
						<h2 className="mt-6 text-2xl font-semibold">Ops! Nada encontrado</h2>

						<p className="mt-3 max-w-sm text-sm text-muted-foreground">
							Parece que você tentou acessar uma página que não existe ou foi movida para outro endereço.
						</p>
					</motion.div>

					<motion.div
						initial={{
							opacity: 0,
							y: 15,
						}}
						animate={{
							opacity: 1,
							y: 0,
						}}
						transition={{
							delay: 0.45,
						}}
						className="mt-8 flex gap-3"
					>
						<Button asChild>
							<Link to="/">
								<Home className="mr-2 size-4" />
								Início
							</Link>
						</Button>

						<Button variant="outline" onClick={() => window.history.back()}>
							<ArrowLeft className="mr-2 size-4" />
							Voltar
						</Button>
					</motion.div>
				</CardContent>

				<CardFooter className="justify-center border-t py-4">
					<p className="text-xs text-muted-foreground">Tracevault - Página indisponível</p>
				</CardFooter>
			</Card>
		</main>
	);
}
