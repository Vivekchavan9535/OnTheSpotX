import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationUi({page, setPage, totalPages}) {
	const onChange = (event, value) => {
		setPage(value)
	}

	return (
		<Stack spacing={2}>
			<Pagination count={totalPages} page={page} variant="outlined" shape="rounded" onChange={onChange} />
		</Stack>
	);
}
