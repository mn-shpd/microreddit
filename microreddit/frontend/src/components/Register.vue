<template>
    <form>
        <div class="mb-3">
            <label for="input-nick" class="form-label">Nazwa użytkownika</label>
            <input type="text" class="form-control" id="input-nick">
        </div>
        <div class="mb-3">
            <label for="input-email" class="form-label">Adres e-mail</label>
            <input type="email" class="form-control" id="input-email">
        </div>
        <div class="mb-3">
            <label for="input-password" class="form-label">Hasło</label>
            <input type="password" class="form-control" id="input-password">
        </div>
        <button type="submit" class="btn btn-primary">Zatwierdź</button>
    </form>
</template>

<script>
export default {
  name: 'Register'
}
</script>

<style scoped lang="scss">

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
