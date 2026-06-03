$(function () {
    $('.remover').click(function (e) {
        e.preventDefault();

        const id = $(this).data('id');
        const name = $(this).data('name');
        const resource = $(this).data('resource');
        const label = $(this).data('label') || 'registro';

        Swal.fire({
            title: `Deseja excluir ${label} ${name}?`,
            text: 'Esta ação não poderá ser desfeita.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (!result.isConfirmed || !resource) {
                return;
            }

            try {
                const response = await fetch(`/${resource}/${id}/remover`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    return;
                }

                Swal.fire({
                    title: 'Excluído!',
                    text: `${label} ${name} excluído com sucesso.`,
                    icon: 'success',
                    timer: 5000,
                    willClose: () => {
                        location.reload();
                    },
                });
            } catch (error) {
                console.log(error);
            }
        });
    });

    $('.form-control').focus(function () {
        $(this).removeClass('is-invalid');
        $(this)
            .closest('.form-group')
            .find('.invalid-feedback')
            .attr('style', 'display: none !important');
    });
});
