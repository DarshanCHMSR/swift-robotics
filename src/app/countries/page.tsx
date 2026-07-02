import { getCountries } from '@/app/actions/country'
import CountriesClient from './countries-client'

export default async function CountriesPage() {
  const countries = await getCountries()
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Countries</h2>
      <p className="text-muted-foreground">Manage the countries you want to monitor.</p>
      <CountriesClient initialCountries={countries} />
    </div>
  )
}
