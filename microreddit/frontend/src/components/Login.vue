<template>
    <div id="content">
        <form>
            <h1>Logowanie</h1>
            <div class="mb-3">
                <label for="input-nick" class="form-label">Nazwa użytkownika</label>
                <input type="text" class="form-control" id="input-nick">
            </div>
            <div class="mb-3">
                <label for="input-password" class="form-label">Hasło</label>
                <input type="password" class="form-control" id="input-password">
            </div>
            <button type="submit" class="btn">Zatwierdź</button>
        </form>
    </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style scoped lang="scss">

    form {
        h1 {
            margin: 30px;
        }

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        button {
            background-color: bisque;
            border: 1px solid black;

            &:hover {
                background-color: orange;
            }
        }
    }
</style>