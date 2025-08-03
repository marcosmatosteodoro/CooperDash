import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';

type UseDeleteWithConfirmationParams = {
  entityName: string; // "cooperado", "usuário", etc.
  redirectTo?: string; // rota de redirecionamento após exclusão
  deleteAction: (id: number) => any; // action do Redux
};

export const useDeleteWithConfirmation = ({
  entityName,
  redirectTo,
  deleteAction,
}: UseDeleteWithConfirmationParams) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja realmente excluir este ${entityName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      await dispatch(deleteAction(id));
      await Swal.fire('Excluído!', `O ${entityName} foi excluído.`, 'success');

      if(redirectTo) {
        router.push(redirectTo);
      }
    }
  };

  return handleDelete;
};
