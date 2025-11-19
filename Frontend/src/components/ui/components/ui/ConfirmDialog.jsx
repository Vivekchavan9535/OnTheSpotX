import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const ConfirmDialog = ({
	title,
	desc,
	actionLabel = "Confirm",
	trigger,
	onConfirm
}) => {
	return (
		<AlertDialog>

			{/* Trigger button you pass */}
			<AlertDialogTrigger asChild>
				{trigger}
			</AlertDialogTrigger>

			<AlertDialogContent className="w-[80%]  rounded-lg p-4">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{desc}</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					<AlertDialogAction
						onClick={onConfirm}
						className="bg-red-600 hover:bg-red-700"
					>
						{actionLabel}
					</AlertDialogAction>

				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
