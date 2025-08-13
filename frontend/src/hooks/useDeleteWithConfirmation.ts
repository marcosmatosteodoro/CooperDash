'use client'

import { useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import { AsyncThunkAction } from '@reduxjs/toolkit';

type UseDeleteWithConfirmationParams = {
  entityName: string;
  redirectTo?: string;
  deleteAction: (id: string) => AsyncThunkAction<string, string, object>;
};

export const useDeleteWithConfirmation = ({ entityName, redirectTo, deleteAction}: UseDeleteWithConfirmationParams) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
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
      setDeleting(true);
      await dispatch(deleteAction(id)).unwrap();
      await Swal.fire('Excluído!', `O ${entityName} foi excluído.`, 'success');

      if(redirectTo) {
        router.push(redirectTo);
      }
    }
  };

  return {
    handleDelete,
    deleting
  };
};