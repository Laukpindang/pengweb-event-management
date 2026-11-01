import { useForm } from '@tanstack/react-form'

import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_authed/team/$id/member/add')({
	component: RouteComponent
})

function RouteComponent() {
	const form = useForm({
		defaultValues: {
			name: '',
			email: ''
		},
		onSubmit: ({ value }) => {
			console.log('Form submitted with values:', value)
			fetch(`https://jsonplaceholder.typicode.com/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(value)
			}).then(async (res) => {
				console.log('Response:', await res.json())
			})
		}
	})

	return (
		<div>
			<h1 className="text-3xl mb-10">Tambah Anggota</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					form.handleSubmit()
				}}
			>
				<FieldGroup>
					<form.Field name="name">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Nama</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										autoComplete="off"
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							)
						}}
					</form.Field>
					<form.Field name="email">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Email</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										autoComplete="off"
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							)
						}}
					</form.Field>
				</FieldGroup>
				<Button type="submit" className="mt-5">
					Submit
				</Button>
			</form>
		</div>
	)
}
