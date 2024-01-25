import { TodoForm } from '@/app/form';
import { getData } from '../actions';

export default async function Todos() {

	const data = await getData()

	return <TodoForm data={data} />;
}
