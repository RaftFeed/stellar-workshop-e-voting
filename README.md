ID = CCSRB3CWYXM473AMFP6ZNEJE7WQQDD6BGV7HE4P7YHAUBRIDC4BNJHJY

# Stellar E-Voting DApp

**Stellar E-Voting DApp** - Blockchain-Based Decentralized Campus Voting System

## Project Description

Stellar E-Voting DApp is a decentralized smart contract application built on the Stellar blockchain using the Soroban SDK. This project enables secure, transparent, and tamper-proof digital voting directly on-chain for campus organizations, student elections, and governance systems.

The smart contract allows users to:

* Register election candidates
* View all candidates
* Cast votes securely
* Prevent duplicate voting
* Display real-time voting results

All voting data is stored inside Soroban contract storage, ensuring transparency, persistence, and decentralization without relying on centralized servers or databases.

Each voting record contains:

* Unique candidate ID
* Candidate name
* Total vote count
* Voter wallet verification

This system demonstrates how blockchain technology can be applied to modern democratic systems while maintaining fairness, transparency, and immutability.

---

# Project Vision

Our vision is to build a decentralized digital voting ecosystem that guarantees transparency, fairness, and trust for campus-level elections and organizational governance.

We aim to:

* **Decentralize Voting Systems**
  Replace traditional centralized voting systems with blockchain infrastructure.

* **Ensure Voting Integrity**
  Prevent vote manipulation and duplicate voting through smart contracts.

* **Provide Transparency**
  All voting activities and results are verifiable on-chain.

* **Guarantee Security**
  Voting records are immutable and securely stored on the Stellar blockchain.

* **Promote Web3 Adoption**
  Introduce blockchain utility through practical governance applications.

---

# Key Features

## 1. Register Candidates

* Add election candidates easily
* Automatic unique ID generation
* Candidate data stored permanently on-chain

## 2. View All Candidates

* Retrieve all registered candidates
* Display live vote counts
* Easy frontend integration

## 3. Secure Voting System

* One wallet = one vote
* Prevent duplicate voting
* Wallet authentication using Soroban

## 4. Real-Time Vote Counting

* Vote counts update instantly
* Transparent election results
* Fully verifiable on-chain

## 5. Secure Blockchain Storage

* Built on Stellar Soroban
* Immutable voting history
* Transparent smart contract logic
* Decentralized data persistence

---

# Contract Functions

## `add_candidate(name)`

Adds a new candidate into storage.

### Parameters

* `name` → Candidate name

---

## `get_candidates()`

Returns all registered candidates.

### Returns

Vector of:

```rust
Candidate {
    id: u64,
    name: String,
    vote_count: u32,
}