'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login, signup, createTodos } from '@/app/actions';
import {
	useForm,
	control,
	getFormProps,
	getInputProps,
	getFieldsetProps,
} from '@conform-to/react';
import { type DefaultValue } from '@conform-to/dom'
import { parseWithZod } from '@conform-to/zod';
import { todosSchema, loginSchema, createSignupSchema } from '@/app/schema';
import { z } from 'zod';

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const { pending } = useFormStatus();

	return <button {...props} disabled={pending || props.disabled} />;
}

export function TodoForm({ defaultValue }: { defaultValue: DefaultValue<z.output<typeof todosSchema>>}) {

	const [lastResult, action] = useFormState(createTodos, undefined);
	const [form, fields] = useForm({
		defaultValue,
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: todosSchema });
		},
		shouldValidate: 'onBlur',
	});
	const tasks = fields.tasks.getFieldList();

	const status = lastResult?.status

	return (
		<form action={action} {...getFormProps(form)}>
			<div>
				<label>Title</label>
				<input
					className={!fields.title.valid ? 'error' : ''}
					{...getInputProps(fields.title)}
					key={fields.title.key}
				/>
				<div>{fields.title.errors}</div>
			</div>
			<hr />
			<div className="form-error">{fields.tasks.errors}</div>
			{tasks.map((task, index) => {
				const taskFields = task.getFieldset();

				return (
					<fieldset key={task.key} {...getFieldsetProps(task)}>
						<div>
							<label>Task #${index + 1}</label>
							<input
								className={!taskFields.content.valid ? 'error' : ''}
								{...getInputProps(taskFields.content)}
								key={taskFields.content.key}
							/>
							<div>{taskFields.content.errors}</div>
						</div>
						<div>
							<label>
								<span>Completed</span>
								<input
									className={!taskFields.completed.valid ? 'error' : ''}
									{...getInputProps(taskFields.completed, {
										type: 'checkbox',
									})}
									key={taskFields.completed.key}
								/>
							</label>
						</div>
						<Button
							{...form.getControlButtonProps(
								control.remove({ name: fields.tasks.name, index }),
							)}
						>
							Delete
						</Button>
						<Button
							{...form.getControlButtonProps(
								control.reorder({
									name: fields.tasks.name,
									from: index,
									to: 0,
								}),
							)}
						>
							Move to top
						</Button>
						<Button
							{...form.getControlButtonProps(
								control.replace({ name: task.name, value: { content: '' } }),
							)}
						>
							Clear
						</Button>
					</fieldset>
				);
			})}
			<Button
				{...form.getControlButtonProps(
					control.insert({ name: fields.tasks.name }),
				)}
			>
				Add task
			</Button>
			<hr />
			<div>
				Dirty: {form.dirty ? 'True' : 'False'}
			</div>
			<div>
				form.status: {form.status ?? 'undefined'}
			</div>
			<div>default value:</div>
			<pre>{JSON.stringify(defaultValue, null, 2)}</pre>

			<div>form.value:</div>
			{form.value ? <pre>{JSON.stringify(form.value, null, 2)}</pre> : <div>undefined</div>}

			<div>lastResult:</div>
			{lastResult ? <pre>{JSON.stringify(lastResult, null, 2)}</pre> : <div>undefined</div>}
			<Button disabled={!form.dirty}>Save</Button>
			<Button  {...form.getControlButtonProps(control.reset())}>Reset</Button>
		</form>
	);
}

export function LoginForm() {
	const [lastResult, action] = useFormState(login, undefined);
	const [form, fields] = useForm({
		// Sync the result of last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: loginSchema });
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',
	});

	return (
		<form action={action} {...getFormProps(form)}>
			<div>
				<label>Email</label>
				<input
					className={!fields.email.valid ? 'error' : ''}
					{...getInputProps(fields.email)}
					key={fields.email.key}
				/>
				<div>{fields.email.errors}</div>
			</div>
			<div>
				<label>Password</label>
				<input
					className={!fields.password.valid ? 'error' : ''}
					{...getInputProps(fields.password, { type: 'password' })}
					key={fields.password.key}
				/>
				<div>{fields.password.errors}</div>
			</div>
			<label>
				<div>
					<span>Remember me</span>
					<input {...getInputProps(fields.remember, { type: 'checkbox' })} />
				</div>
			</label>
			<hr />
			<Button>Login</Button>
		</form>
	);
}

export function SignupForm() {
	const [lastResult, action] = useFormState(signup, undefined);
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				// Create the schema without any constraint defined
				schema: (control) => createSignupSchema(control),
			});
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	});

	return (
		<form action={action} {...getFormProps(form)}>
			<label>
				<div>Username</div>
				<input
					className={!fields.username.valid ? 'error' : ''}
					{...getInputProps(fields.username)}
					key={fields.username.key}
				/>
				<div>{fields.username.errors}</div>
			</label>
			<label>
				<div>Password</div>
				<input
					className={!fields.password.valid ? 'error' : ''}
					{...getInputProps(fields.password, { type: 'password' })}
					key={fields.password.key}
				/>
				<div>{fields.password.errors}</div>
			</label>
			<label>
				<div>Confirm Password</div>
				<input
					className={!fields.confirmPassword.valid ? 'error' : ''}
					{...getInputProps(fields.confirmPassword, { type: 'password' })}
					key={fields.confirmPassword.key}
				/>
				<div>{fields.confirmPassword.errors}</div>
			</label>
			<hr />
			<Button>Signup</Button>
		</form>
	);
}
