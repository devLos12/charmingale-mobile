import { useLocalSearchParams } from 'expo-router';
import { CategoryScreen } from '@/features/categories';


export default function categoryScreen() {
    const { colorName } = useLocalSearchParams<{ colorName: string }>();
    return <CategoryScreen colorName={ colorName }/>
}

