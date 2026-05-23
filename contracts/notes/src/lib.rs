#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    symbol_short, Address, Env, String,
    Symbol, Vec,
};

#[contracttype]
#[derive(Clone)]
pub struct Candidate {
    id: u64,
    name: String,
    vote_count: u32,
}

#[contracttype]
#[derive(Clone)]
pub struct VoteRecord {
    voter: Address,
    candidate_id: u64,
}

const CANDIDATES: Symbol = symbol_short!("CANDS");
const VOTES: Symbol = symbol_short!("VOTES");

#[contract]
pub struct EVotingContract;

#[contractimpl]
impl EVotingContract {

    // Tambah kandidat
    pub fn add_candidate(env: Env, name: String) {
        let mut candidates: Vec<Candidate> =
            env.storage()
                .instance()
                .get(&CANDIDATES)
                .unwrap_or(Vec::new(&env));

        let candidate = Candidate {
            id: env.prng().gen::<u64>(),
            name,
            vote_count: 0,
        };

        candidates.push_back(candidate);

        env.storage().instance().set(&CANDIDATES, &candidates);
    }

    // Ambil semua kandidat
    pub fn get_candidates(env: Env) -> Vec<Candidate> {
        env.storage()
            .instance()
            .get(&CANDIDATES)
            .unwrap_or(Vec::new(&env))
    }

    // Voting
    pub fn vote(env: Env, voter: Address, candidate_id: u64) -> String {

        voter.require_auth();

        let mut votes: Vec<VoteRecord> =
            env.storage()
                .instance()
                .get(&VOTES)
                .unwrap_or(Vec::new(&env));

        // cek apakah user sudah voting
        for i in 0..votes.len() {
            let vote = votes.get(i).unwrap();

            if vote.voter == voter {
                return String::from_str(&env, "Sudah voting");
            }
        }

        let mut candidates: Vec<Candidate> =
            env.storage()
                .instance()
                .get(&CANDIDATES)
                .unwrap_or(Vec::new(&env));

        // tambah vote kandidat
        for i in 0..candidates.len() {
            let mut candidate = candidates.get(i).unwrap();

            if candidate.id == candidate_id {
                candidate.vote_count += 1;

                candidates.set(i, candidate);

                let record = VoteRecord {
                    voter,
                    candidate_id,
                };

                votes.push_back(record);

                env.storage().instance().set(&CANDIDATES, &candidates);
                env.storage().instance().set(&VOTES, &votes);

                return String::from_str(&env, "Voting berhasil");
            }
        }

        String::from_str(&env, "Kandidat tidak ditemukan")
    }
}