import { ClientSummary } from "./types";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Loader } from "@/app/components/Loader";

type Props = {
    client: ClientSummary;
    isOpen: boolean;
}

const [name, setName] = useState();
const [phone, setPhone] = useState();
const [note, setNote] = useState();

export function EditClientModal({ client, isOpen }: Props) {
    return (
        <div className="border z-50">
            <form>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
                <button type="submit">Save</button>
            </form>

        </div>
    )
}