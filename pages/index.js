import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import pokedex from '../data/pokedex.json'

export default function Home() {
  const [score, setScore] = useState(0)

  const [pokemon, setPokemon] = useState(null)
  const [guess, setGuess] = useState('')

  const handleAnswer = (event) => {
    event.preventDefault()

    if (guess.toLowerCase() == pokemon.name.english.toLowerCase()) {
      setScore((state) => {
        const update = (state += 1)

        localStorage.setItem('score', update)

        return update
      })

      setGuess('')

      handleSelect()

      toast.success('You got that right! +1 point')
    } else {
      const _guess = guess.split('')

      pokemon?.name?.english.split('').map((letter, key) => {
        console.log(`${key}: ${letter}`)
      })

      toast.error('Whoops! Try again')
    }
  }

  const handleHint = () => {}

  const handleSelect = () => {
    const random = pokedex[Math.floor(Math.random() * pokedex.length)]

    setPokemon(random)
  }

  const handleSkip = useCallback(() => {
    handleSelect()

    setScore((state) => (state -= 2))
  })

  useEffect(() => {
    handleSelect()

    const score = window.localStorage.getItem('score')

    if (score) {
      setScore(parseInt(score))
    }
  }, [])

  return (
    <main className='flex h-screen items-center justify-center w-full'>
      <div className='flex flex-col items-center'>
        <div>
          <p className='font-bold mb-12 text-center text-4xl'>{score}</p>

          <div className='h-48 mx-auto relative w-48'>
            {pokemon?.id && (
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`}
                alt='Pokémon'
                fill
                className='object-contain'
              />
            )}
          </div>

          <div className='flex font-light items-center justify-center space-x-4 text-4xl text-slate-500'>
            {pokemon && [...pokemon['name']['english']].map((letter, key) => <p key={key}>_</p>)}
          </div>

          {/* <p className='text-center'>Hint: {pokemon?.name?.english}</p> */}
        </div>

        <form onSubmit={handleAnswer} className='mt-8'>
          <input
            type='text'
            value={guess}
            placeholder='Type your guess here'
            onChange={(element) => setGuess(element.target.value)}
            className='border px-4 py-2 rounded-lg'
          />

          <button type='submit' className='hidden'>
            Submit
          </button>
        </form>

        <button type='submit' onClick={handleHint}>
          Hint
        </button>
        <button type='submit' onClick={handleSkip}>
          Skip
        </button>
      </div>
    </main>
  )
}
