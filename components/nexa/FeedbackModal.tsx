"use client";

import { useState, useEffect } from "react";
import { X, Star, Heart } from "lucide-react";

interface FeedbackModalProps {
	isOpen: boolean;
	onClose: () => void;
	productTitle?: string;
}

export const FeedbackModal = ({
	isOpen,
	onClose,
	productTitle = "Your Product",
}: FeedbackModalProps) => {
	const [rating, setRating] = useState(0);
	const [feedback, setFeedback] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Prevent background scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

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
				priorities: "", // Legacy field required by script
				bigIdea: feedback, // Map feedback to bigIdea column
				userAgent: navigator.userAgent,
			};

			await fetch(
				"https://script.google.com/macros/s/AKfycbyozLf4LoY0CIHf2AXF1dgbXlPBAHcG0Oc8ZzhsCJumVK9IiI6ur4jzhScpjwuI2JqM/exec",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(feedbackData),
					mode: "no-cors",
				}
			);

			setIsSubmitted(true);
			setTimeout(() => handleClose(), 2000);
		} catch (error) {
			console.error("Failed to submit feedback:", error);
			setIsSubmitted(true);
			setTimeout(() => handleClose(), 2000);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setRating(0);
		setFeedback("");
		setIsSubmitted(false);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
			<div className="w-full max-w-md bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
				{/* Close Button */}
				<button
					onClick={handleClose}
					className="absolute top-6 right-6 p-2 rounded-lg hover:bg-white/10 transition-all"
				>
					<X className="h-5 w-5 text-gray-400" />
				</button>

				{isSubmitted ? (
					// Success State
					<div className="text-center py-8">
						<div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
							<Heart className="h-10 w-10 text-green-400 fill-green-400" />
						</div>
						<h3 className="text-3xl font-bold text-white mb-3">Thank you!</h3>
						<p className="text-gray-400">Your feedback helps us improve NEXA</p>
					</div>
				) : (
					// Form State
					<>
						{/* Header */}
						<div className="mb-8">
							<h3 className="text-3xl font-bold text-white mb-2">Rate Your Experience</h3>
							<p className="text-gray-400">Help us make NEXA better for you</p>
						</div>

						{/* Rating */}
						<div className="mb-8">
							<label className="block text-sm font-medium text-gray-300 mb-4">
								How satisfied are you? <span className="text-red-400">*</span>
							</label>
							<div className="flex gap-2 justify-center">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										type="button"
										onClick={() => setRating(star)}
										className="p-3 rounded-xl transition-all hover:scale-110"
									>
										<Star
											className="h-8 w-8 transition-all"
											style={{
												color: star <= rating ? "#3B82F6" : "#6B7280",
												fill: star <= rating ? "#3B82F6" : "none",
											}}
										/>
									</button>
								))}
							</div>
						</div>

						{/* Feedback */}
						<div className="mb-8">
							<label className="block text-sm font-medium text-gray-300 mb-4">
								What could we improve?
							</label>
							<textarea
								value={feedback}
								onChange={(e) => setFeedback(e.target.value)}
								placeholder="Share your thoughts, ideas, or suggestions..."
								rows={4}
								className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
							/>
						</div>

						{/* Actions */}
						<div className="flex gap-3">
							<button
								onClick={handleSubmit}
								disabled={isSubmitting || rating === 0}
								className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/50"
							>
								{isSubmitting ? (
									<div className="flex items-center justify-center gap-2">
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										<span>Sending...</span>
									</div>
								) : (
									"Submit Feedback"
								)}
							</button>
							<button
								onClick={handleClose}
								className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all"
							>
								Skip
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
