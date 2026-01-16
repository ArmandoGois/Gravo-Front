import Image from "next/image";

const getModelIcon = (modelName: string) => {
    const name = modelName.toLowerCase();
    if (name.includes("gemini")) return "/Gemini.svg";
    if (name.includes("deepseek")) return "/DeepSeek.svg";
    if (name.includes("mistral")) return "/Mistral.svg";
    if (name.includes("claude")) return "/ClaudeAI.svg";
    if (name.includes("gpt")) return "/ChatGPT.svg";
    return null;
};


export const ModelIcon = ({ modelName }: { modelName: string }) => {
    const iconPath = getModelIcon(modelName);
    if (!iconPath) return null;
    return <Image src={iconPath} alt={modelName} width={18} height={18} className="shrink-0 object-contain" />;
};