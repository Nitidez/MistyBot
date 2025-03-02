import MistyClient from "@/lib/MistyClient";
import { ActivityType } from "discord.js";

export default async function ready(client: MistyClient) {
    client.user?.setActivity({type: ActivityType.Playing, name: "x servers."});
}