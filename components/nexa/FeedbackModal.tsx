"use client";

import { useState, useEffect } from "react";
import { Button, Card } from "@whop/react/components";
import { X, Star, Download, MessageSquare } from "lucide-react";

interface FeedbackModalProps {
	isOpen: boolean;
	onClose: () => void;
	productTitle: string;
}

export const FeedbackModal = ({
	isOpen,
	onClose,
	productTitle,
}: FeedbackModalProps) => {
	const [rating, setRating] = useState(0);
	const [priorities, setPriorities] = useState<string[]>([]);
	const [bigIdea, setBigIdea] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Prevent background scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		// Cleanup on unmount
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const handlePriorityChange = (priority: string) => {
		setPriorities((prev) =>
			prev.includes(priority)
				? prev.filter((p) => p !== priority)
				: [...prev, priority],
		);
	};

	const handleSubmit = async () => {
		if (rating === 0) {
			alert("Please provide a rating before submitting.");
			return;
		}

		setIsSubmitting(true);

		try {
			const feedbackData = {
				timestamp: new Date().toISOString(),
				productTitle,
				rating,
				priorities: priorities.join(", "),
				bigIdea,
				userAgent: navigator.userAgent,
			};

			console.log("Submitting feedback:", feedbackData);

			// Send to Google Apps Script endpoint
			const response = await fetch(
				"https://script.google.com/macros/s/AKfycbyozLf4LoY0CIHf2AXF1dgbXlPBAHcG0Oc8ZzhsCJumVK9IiI6ur4jzhScpjwuI2JqM/exec",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(feedbackData),
					mode: "no-cors", // Required for Google Apps Script
				},
			);

			console.log("Feedback response:", response);

			setIsSubmitted(true);

			// Auto-close after success
			setTimeout(() => {
				handleClose();
			}, 2000);
		} catch (error) {
			console.error("Failed to submit feedback:", error);

			// Still show success to user even if it fails
			setIsSubmitted(true);
			setTimeout(() => {
				handleClose();
			}, 2000);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		// Reset form
		setRating(0);
		setPriorities([]);
		setBigIdea("");
		setIsSubmitted(false);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<>
			<style jsx global>{`
				body.modal-open {
					overflow: hidden;
				}
			`}</style>
			<div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
			<Card
				className="nexa-gray-glow nexa-transition-slow relative overflow-hidden"
				style={{
					backgroundColor: "rgba(17, 17, 17, 0.95)",
					border: "1px solid rgba(255, 255, 255, 0.1)",
					borderRadius: "16px",
					padding: "0",
					maxWidth: "520px",
					width: "100%",
					maxHeight: "85vh",
					overflowY: "auto",
					boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
				}}
			>
				<div style={{ padding: "2rem", position: "relative", zIndex: 1 }}>
					{/* Header */}
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center gap-4">
							<div
								className="w-12 h-12 rounded-xl flex items-center justify-center"
								style={{
									background:
										"linear-gradient(135deg, rgba(0, 123, 255, 0.2), rgba(0, 123, 255, 0.1))",
									border: "1px solid rgba(0, 123, 255, 0.3)",
								}}
							>
								<MessageSquare
									className="h-6 w-6"
									style={{ color: "#007BFF" }}
								/>
							</div>
							<div>
								<h3 className="font-bold text-white text-lg">
									Help us improve NEXA!
								</h3>
								<p
									className="text-sm text-gray-400"
									style={{ opacity: 0.8 }}
								>
									Your feedback shapes our future
								</p>
							</div>
						</div>
						<button
							onClick={handleClose}
							className="p-2 rounded-xl hover:bg-white/5 transition-all duration-200 hover:scale-105"
						>
							<X className="h-5 w-5 text-gray-400" />
						</button>
					</div>

					{isSubmitted ? (
						<div className="text-center py-12">
							<div
								className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
								style={{
									background:
										"linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))",
									border: "1px solid rgba(16, 185, 129, 0.3)",
								}}
							>
								<svg
									className="h-10 w-10 text-green-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<h4 className="text-xl font-bold text-white mb-3">
								Thank you! 🎉
							</h4>
							<p
								className="text-gray-400 text-sm"
								style={{ opacity: 0.8 }}
							>
								Your feedback helps us build better features
							</p>
						</div>
					) : (
						<>
							{/* Product Reference */}
							<div
								className="mb-8 p-4 rounded-2xl border"
								style={{
									background:
										"linear-gradient(135deg, rgba(0, 123, 255, 0.08), rgba(0, 123, 255, 0.03))",
									borderColor: "rgba(0, 123, 255, 0.2)",
								}}
							>
								<p
									className="text-sm text-gray-300 mb-1"
									style={{ opacity: 0.9 }}
								>
									Your generated product:
								</p>
								<p
									className="text-white font-medium"
									style={{ fontSize: "0.95rem" }}
								>
									{productTitle || "Untitled Product"}
								</p>
							</div>

							{/* Rating */}
							<div className="mb-8">
								<label className="block text-sm font-medium text-gray-200 mb-4">
									Overall Satisfaction{" "}
									<span className="text-red-400 ml-1">*</span>
								</label>
								<div className="flex gap-3 justify-center">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											onClick={() => setRating(star)}
											className="p-3 rounded-xl transition-all duration-200 hover:scale-110"
											style={{
												background:
													star <= rating
														? "linear-gradient(135deg, rgba(0, 123, 255, 0.2), rgba(0, 123, 255, 0.1))"
														: "rgba(255, 255, 255, 0.03)",
												border:
													star <= rating
														? "1px solid rgba(0, 123, 255, 0.4)"
														: "1px solid rgba(255, 255, 255, 0.15)",
												transform:
													star <= rating
														? "scale(1.05)"
														: "scale(1)",
											}}
										>
											<Star
												className="h-7 w-7 transition-colors"
												style={{
													color:
														star <= rating
															? "#007BFF"
															: "#6B7280",
													fill:
														star <= rating ? "#007BFF" : "none",
												}}
											/>
										</button>
									))}
								</div>
							</div>

							{/* Priorities */}
							<div className="mb-8">
								<label className="block text-sm font-medium text-gray-200 mb-4">
									What should we prioritize?
								</label>
								<div className="space-y-3">
									{[
										"Better content quality",
										"More product format options",
										"Faster generation",
										"Better user interface",
									].map((option) => (
										<label
											key={option}
											className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5"
											style={{
												background: priorities.includes(option)
													? "linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.05))"
													: "rgba(255, 255, 255, 0.02)",
												border: priorities.includes(option)
													? "1px solid rgba(0, 123, 255, 0.3)"
													: "1px solid rgba(255, 255, 255, 0.1)",
											}}
										>
											<input
												type="checkbox"
												checked={priorities.includes(option)}
												onChange={() =>
													handlePriorityChange(option)
												}
												className="w-5 h-5 rounded"
												style={{
													accentColor: "#007BFF",
													borderColor: "rgba(255, 255, 255, 0.3)",
												}}
											/>
											<span
												className="text-sm text-gray-200"
												style={{ opacity: 0.9 }}
											>
												{option}
											</span>
										</label>
									))}
									<label
										className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5"
										style={{
											background: priorities.includes("other")
												? "linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.05))"
												: "rgba(255, 255, 255, 0.02)",
											border: priorities.includes("other")
												? "1px solid rgba(0, 123, 255, 0.3)"
												: "1px solid rgba(255, 255, 255, 0.1)",
										}}
									>
										<input
											type="checkbox"
											checked={priorities.includes("other")}
											onChange={() => handlePriorityChange("other")}
											className="w-5 h-5 rounded"
											style={{
												accentColor: "#007BFF",
												borderColor: "rgba(255, 255, 255, 0.3)",
											}}
										/>
										<span
											className="text-sm text-gray-200"
											style={{ opacity: 0.9 }}
										>
											Other:
										</span>
										<input
											type="text"
											placeholder="Specify..."
											className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm ml-2"
											style={{
												display: priorities.includes("other")
													? "block"
													: "none",
											}}
										/>
									</label>
								</div>
							</div>

							{/* Big Idea */}
							<div className="mb-8">
								<label className="block text-sm font-medium text-gray-200 mb-4">
									Your big idea for NEXA:
								</label>
								<textarea
									value={bigIdea}
									onChange={(e) => setBigIdea(e.target.value)}
									placeholder="What feature would make NEXA 10x better for you?"
									rows={4}
									className="w-full px-4 py-3 rounded-2xl border border-white/10 text-white placeholder-gray-500 text-sm resize-none transition-all focus:border-blue-500/50 focus:bg-white/5"
									style={{
										background: "rgba(255, 255, 255, 0.03)",
										fontSize: "0.9rem",
									}}
								/>
							</div>

							{/* Actions */}
							<div className="flex gap-3">
								<Button
									variant="classic"
									size="3"
									onClick={handleSubmit}
									disabled={isSubmitting || rating === 0}
									className="flex-1 nexa-transition font-medium"
									style={{
										background:
											"linear-gradient(135deg, #007BFF, #0056b3)",
										border: "none",
										height: "48px",
									}}
								>
									{isSubmitting ? (
										<>
											<div
												className="w-4 h-4 rounded-full animate-spin mr-2"
												style={{
													border:
														"2px solid rgba(255,255,255,0.3)",
													borderTop: "2px solid white",
												}}
											/>
											Submitting...
										</>
									) : (
										"Submit Feedback"
									)}
								</Button>
								<Button
									variant="classic"
									size="3"
									onClick={handleClose}
									className="nexa-transition font-medium"
									style={{
										background: "transparent",
										border: "1px solid rgba(255, 255, 255, 0.2)",
										height: "48px",
									}}
								>
									Maybe later
								</Button>
							</div>
						</>
					)}
				</div>

				{/* Frosted overlay */}
				<div
					className="absolute inset-0 pointer-events-none nexa-inner-glow"
					style={{ borderRadius: "12px" }}
				/>
			</Card>
		</div>
		</>
	);
};
