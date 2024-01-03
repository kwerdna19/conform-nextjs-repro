import { TodoForm } from '@/app/form';
import { getTodos } from '../actions';

export const dynamic = 'force-dynamic'

export default async function Todos() {

	const todos = await getTodos()

	console.log('page component', todos)

	return <TodoForm defaultValue={todos} />;
}
