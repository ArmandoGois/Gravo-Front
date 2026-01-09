export interface AIModel {
    "id": string,
    "provider": string,
    "name": string,
    "type": string,
    "input_cost": number,
    "output_cost": number,
    "max_tokens": number,
    "supports_images": boolean,
    "supports_video": boolean,
    "max_video_duration": number | null,
    "max_video_resolution": string | null
}