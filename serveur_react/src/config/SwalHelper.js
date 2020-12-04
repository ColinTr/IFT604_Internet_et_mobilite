import * as Swal from "sweetalert2";

function createNoConnectionSmallPopUp(error, timer=2000) {
    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: timer,
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

function createSmallSuccessPopUp(message) {
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
        icon: 'success',
        title: message
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

export default {createNoConnectionSmallPopUp, createPleaseReconnectLargePopUp, createSmallSuccessPopUp};