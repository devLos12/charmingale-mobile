
import { ConceptScreen } from "@/features/categories"
import { useLocalSearchParams } from "expo-router"



export default function conceptScreen(){
    const { conceptId } = useLocalSearchParams<{ conceptId: string }>();
    return <ConceptScreen conceptId={conceptId} />
}

