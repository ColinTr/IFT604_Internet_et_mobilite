import * as Swal from "sweetalert2";

function createNoConnectionSmallPopUp(error) {
    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    }).fire({
        icon: 'error',
        title: error
    });
}

function createPleaseReconnectLargePopUp(res) {
    Swal.fire({
        title: "La session a expirée",
        icon: 'error',
        confirmButtonText: 'Se reconnecter'
    }).then((result) => {
        if (result.value) {
            window.location.href = res.redirectUrl
        }
    });
}

export default {createNoConnectionSmallPopUp, createPleaseReconnectLargePopUp};