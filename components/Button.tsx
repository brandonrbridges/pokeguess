import React from 'react'

interface Props {
	children: any
	onClick?: () => void
}

const Button = (props: Props) => {
	return (
		<button
			onClick={props.onClick}
			className='border hover:bg-blue-600 rounded px-4'
		>
			{props.children}
		</button>
	)
}

export default Button
