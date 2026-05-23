#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Env, String, Symbol, Vec,
};

// Struktur data Todo
#[contracttype]
#[derive(Clone, Debug)]
pub struct Todo {
    id: u64,
    task: String,
    completed: bool,
}

// Key storage
const TODO_DATA: Symbol = symbol_short!("TODO_DATA");

#[contract]
pub struct TodoContract;

#[contractimpl]
impl TodoContract {

    // Ambil semua todo
    pub fn get_todos(env: Env) -> Vec<Todo> {
        env.storage()
            .instance()
            .get(&TODO_DATA)
            .unwrap_or(Vec::new(&env))
    }

    // Tambah todo baru
    pub fn add_todo(env: Env, task: String) -> String {

        // 1. Ambil data todo lama
        let mut todos: Vec<Todo> = env.storage()
            .instance()
            .get(&TODO_DATA)
            .unwrap_or(Vec::new(&env));

        // 2. Buat todo baru
        let todo = Todo {
            id: env.prng().gen::<u64>(),
            task,
            completed: false,
        };

        // 3. Tambahkan todo
        todos.push_back(todo);

        // 4. Simpan kembali
        env.storage().instance().set(&TODO_DATA, &todos);

        String::from_str(&env, "Todo berhasil ditambahkan")
    }

    // Menandai todo selesai
    pub fn complete_todo(env: Env, id: u64) -> String {

        // 1. Ambil semua todo
        let mut todos: Vec<Todo> = env.storage()
            .instance()
            .get(&TODO_DATA)
            .unwrap_or(Vec::new(&env));

        // 2. Cari todo berdasarkan id
        for i in 0..todos.len() {

            let mut todo = todos.get(i).unwrap();

            if todo.id == id {

                // ubah status completed
                todo.completed = true;

                // update data
                todos.set(i, todo);

                // simpan kembali
                env.storage().instance().set(&TODO_DATA, &todos);

                return String::from_str(&env, "Todo selesai");
            }
        }

        String::from_str(&env, "Todo tidak ditemukan")
    }

    // Hapus todo
    pub fn delete_todo(env: Env, id: u64) -> String {

        // 1. Ambil semua todo
        let mut todos: Vec<Todo> = env.storage()
            .instance()
            .get(&TODO_DATA)
            .unwrap_or(Vec::new(&env));

        // 2. Cari index todo
        for i in 0..todos.len() {

            if todos.get(i).unwrap().id == id {

                // hapus todo
                todos.remove(i);

                // simpan kembali
                env.storage().instance().set(&TODO_DATA, &todos);

                return String::from_str(&env, "Todo berhasil dihapus");
            }
        }

        String::from_str(&env, "Todo tidak ditemukan")
    }
}

mod test;