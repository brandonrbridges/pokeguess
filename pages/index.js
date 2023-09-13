// React
import { useCallback, useEffect, useState } from 'react'

// Next
import Image from 'next/image'

// Data
import pokedex from '../data/pokedex.json'

// Assets
import pokeballSVG from '../assets/pokeball.svg'

// Packages
import classNames from 'classnames'
import toast from 'react-hot-toast'

// Variables
const storageName = 'pokeguessData'

export default function Home() {
	const [score, setScore] = useState(0)

	const [pokemon, setPokemon] = useState(null)
	const [nextPokemon, setNextPokemon] = useState(null)
	const [hint, setHint] = useState(null)
	const [reveal, setReveal] = useState(false)

	const [guess, setGuess] = useState('')

	const handleAnswer = (event) => {
		event.preventDefault()

		if (!guess) return toast('You need to guess the Pokémon!')

		if (guess.toLowerCase() == pokemon.name.english.toLowerCase()) {
			handleScoreUpdate(1)

			setReveal(true)

			setTimeout(() => {
				setGuess('')

				getNewPokemon()
			}, 2000)

			toast.success('You got that right! +1 point')
		} else {
			const _guess = guess.split('')

			pokemon?.name?.english.split('').map((letter, key) => {
				console.log(`${key}: ${letter}`)
			})

			toast.error('Whoops! Wrong Pokémon! Try again.')
		}
	}

	const handleHint = () => {
		// if all letters are visible, return
		if (hint.every((letter) => letter.visible)) return

		// get a random letter from the hint array
		const random = hint[Math.floor(Math.random() * hint.length)]

		// if the letter is already visible, get another one
		if (random.visible) return handleHint()

		// set the letter to visible
		random.visible = true

		// update the hint state
		setHint((state) => [...state])
	}

	const getNewPokemon = () => {
		// set the current pokemon to the next pokemon
		if (nextPokemon) {
			setPokemon(nextPokemon)
		}

		// get a random pokemon from the pokedex
		const random = pokedex[Math.floor(Math.random() * pokedex.length)]

		// get another random pokemon from the pokedex
		const nextRandom = pokedex[Math.floor(Math.random() * pokedex.length)]

		// if the next random pokemon is the same as the current one, get another one
		if (nextRandom.id === random.id) return getNewPokemon()

		// set the next pokemon
		setNextPokemon(nextRandom)

		// split the name into an array
		const name = random.name.english.split('')

		// create an array with each letter and a boolean value
		const hint = name.map((letter) => ({ letter, visible: false }))

		setPokemon(random)
		setHint(hint)
		setReveal(false)
	}

	const handleReveal = () => {
		setReveal(true)
	}

	const handleSkip = () => {
		getNewPokemon()

		handleScoreUpdate(-1)
	}

	const handleScoreUpdate = (score) => {
		setScore((state) => {
			const update = (state += score)

			localStorage.setItem(storageName, update)

			return update
		})
	}

	useEffect(() => {
		getNewPokemon()

		const score = window.localStorage.getItem(storageName)

		if (score) {
			setScore(parseInt(score))
		}
	}, [])

	return (
		<main className='relative flex h-screen items-center justify-center w-full overflow-hidden'>
			<Image
				src={pokeballSVG}
				alt='Pokéball'
				height={500}
				width={500}
				className='absolute -right-4 -bottom-20 -rotate-12 -z-10 opacity-50'
			/>
			<div className='flex flex-col items-center'>
				<div>
					<div className='mb-6 text-center'>
						<p className='uppercase font-bold text-xs'>Score</p>
						<p className='font-bold text-5xl'>{score}</p>
					</div>

					<div className='h-48 mx-auto relative w-96'>
						{pokemon?.id && (
							<Image
								src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`}
								alt='Pokémon'
								fill
								className={classNames(
									'object-contain transition-all duration-300',
									{
										'brightness-0': !reveal,
									}
								)}
							/>
						)}
					</div>

					<div className='flex font-light items-center justify-center space-x-0.5 text-4xl text-slate-500'>
						{hint &&
							hint.map((letter, key) => (
								<p key={key}>
									{letter.visible ? (
										<span className='font-medium'>{letter.letter}</span>
									) : (
										'_'
									)}
								</p>
							))}
					</div>
				</div>

				<form onSubmit={handleAnswer} className='mt-8 space-x-4'>
					<input
						type='text'
						value={guess}
						placeholder='Guess the Pokémon!'
						onChange={(element) => setGuess(element.target.value)}
						className='border border-slate-100 px-4 py-2 rounded focus:outline-none'
						autoCorrect='off'
					/>

					<button
						type='submit'
						className='bg-white hover:bg-emerald-100 border border-slate-100 hover:border-emerald-200 px-4 py-2 rounded hover:text-emerald-900   transition-colors'
					>
						Submit ✅
					</button>
				</form>

				<div className='flex space-x-4 mt-4'>
					<button
						type='submit'
						onClick={handleReveal}
						className='bg-white border border-slate-100 hover:border-pink-500 px-4 py-1 rounded transition-colors disabled:hover:border-inherit disabled:cursor-not-allowed disabled:opacity-50'
						disabled={reveal}
					>
						Reveal? 🔍
					</button>
					<button
						type='submit'
						onClick={handleHint}
						className='bg-white border border-slate-100 hover:border-orange-500 px-4 py-1 rounded transition-colors'
					>
						Need a hint? 🤔
					</button>
					<button
						type='submit'
						onClick={handleSkip}
						className='bg-white border border-slate-100 hover:border-green-300 px-4 py-1 rounded'
					>
						Skip ➡️
					</button>
				</div>
			</div>
			<div className='absolute bottom-0 left-0 right-0 mb-4 w-full md:w-1/2 mr-auto px-4'>
				<p className='text-xs text-slate-400'>
					&copy; 1995 - {new Date().getFullYear()} Nintendo/Creatures Inc./GAME
					FREAK inc. Pokémon and Pokémon character names are trademarks of
					Nintendo. Trademarks are property of respective owners.
				</p>
			</div>
		</main>
	)
}
