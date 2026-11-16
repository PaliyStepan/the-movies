import {useSearchParams} from 'react-router-dom';
import {useDebouncedValue} from '@mantine/hooks';
import {
  TextInput,
  CloseButton,
  SimpleGrid,
  Pagination,
  Stack,
  Title,
  Text,
  Loader,
  Center,
} from '@mantine/core';
import {useState, useEffect} from 'react';
import {MovieCard, useMovies} from '@/entities/movie';

const SearchInput = ({
     value,
     onChange,
     onClear,
   }: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) => {
  return (
    <TextInput
      placeholder="Поиск фильмов (пример Batman)"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      rightSection={
        value.length > 0 ? <CloseButton onClick={onClear}/> : null
      }
    />
  );
};

export function MoviesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const [input, setInput] = useState(search);
  const [debouncedInput] = useDebouncedValue(input, 500);

  useEffect(() => {
    if (debouncedInput === search) return;
    const params = new URLSearchParams(searchParams);
    if (debouncedInput) params.set('search', debouncedInput);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params, {replace: true});
  }, [debouncedInput]);

  const {data, isPending, isFetching} = useMovies({
    search: debouncedInput,
    page,
    limit: 20,
    sort: 'tmdbRating',
    order: 'desc',
  });

  const handleSearchChange = (value: string) => {
    setInput(value);
  };

  const handleClear = () => {
    setInput('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.set('page', '1');
    setSearchParams(params, {replace: true});
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  return (
    <Stack gap="lg">
      <Title order={2}>Фильмы</Title>

      <SearchInput
        value={input}
        onChange={handleSearchChange}
        onClear={handleClear}
      />

      {debouncedInput.trim().length > 0 && debouncedInput.trim().length < 3 && (
        <Text c="dimmed" size="sm">Введите минимум 3 символа для поиска</Text>
      )}

      {isFetching && debouncedInput.trim().length >= 3 && (
        <Center py="xl"><Loader/></Center>
      )}

      {!isPending && data && data.items.length === 0 && (
        <Text c="dimmed">Ничего не найдено</Text>
      )}

      {data && data.items.length > 0 && (
        <>
          <SimpleGrid cols={{base: 2, md: 4, lg: 5}} spacing="md">
            {data.items.map((movie) => (
              <MovieCard key={movie.id} movie={movie}/>
            ))}
          </SimpleGrid>

          {data.totalPages > 1 && (
            <Center>
              <Pagination
                value={page}
                onChange={handlePageChange}
                total={data.totalPages}
              />
            </Center>
          )}
        </>
      )}
    </Stack>
  );
}
