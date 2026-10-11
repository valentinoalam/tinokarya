import { Sparkles } from "lucide-react";

export default function Loading() {
return (
    <div className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-50">
        <div className="absolute flex justify-center items-center min-h-screen">
            <div className="animate-spin">
                <Sparkles className="w-10 h-10 text-primary" />
            </div>        
        </div>
    </div>
    )
}