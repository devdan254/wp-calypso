import { useMutation, useQueryClient } from 'react-query';
import wpcom from 'calypso/lib/wp';
import { SiteId } from 'calypso/types';
import { PreviewLinksResponse, SITE_PREVIEW_LINKS_QUERY_KEY } from './use-site-preview-links';

export const useCreateSitePreviewLink = ( siteId: SiteId, onError: () => void ) => {
	const queryKey = [ SITE_PREVIEW_LINKS_QUERY_KEY, siteId ];
	const queryClient = useQueryClient();
	const createLinkMutation = useMutation(
		() =>
			wpcom.req.post( {
				path: `/sites/${ siteId }/preview-links`,
				apiNamespace: 'wpcom/v2',
			} ),
		{
			// onSuccess() {
			// 	queryClient.invalidateQueries( [ 'use-site-preview-links', siteId ] );
			// },
			onError: ( err, code, context ) => {
				queryClient.setQueryData( queryKey, context );
				onError?.();
			},
			onMutate: async () => {
				await queryClient.cancelQueries( queryKey );
				const cachedData = queryClient.getQueryData( queryKey );
				queryClient.setQueryData< PreviewLinksResponse >( queryKey, ( old ) => ( {
					preview_links: [
						...( old?.preview_links ?? [] ),
						{
							code: '',
							created_at: '',
							isCreating: true,
						},
					],
				} ) );
				return cachedData;
			},
			onSettled: ( data ) => {
				queryClient.setQueryData( queryKey, () => data );
				queryClient.invalidateQueries( queryKey );
			},
		}
	);

	const { mutate: createLink, ...restMutation } = createLinkMutation;

	return { createLink, ...restMutation };
};
