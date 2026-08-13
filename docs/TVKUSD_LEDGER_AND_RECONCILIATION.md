# TVKUSD Ledger and Reconciliation Specification

**Status:** Architecture / no production money movement  
**Decision date:** 2026-08-13

## 1. Accounting boundary

EnteleLEDGER is the authoritative financial-record direction for the EnteleKRON Financial Mesh. Blockchain balances and events are operational evidence, not a complete general ledger.

The design preserves the existing EnteleLEDGER proof/record role and adds stablecoin, reserve, treasury, payment, custody, tokenization, and institutional subledger requirements.

ENK and TVKUSD are separate assets and accounting domains. TVKUSD never enters ENK supply, allocation, vesting, sale-stage, investor-allocation, or token-valuation calculations.

## 2. Books and ownership

Maintain separate legal-entity books plus purpose-restricted subledgers for:

1. TVKUSD reserve assets;
2. TVKUSD redeemable liabilities;
3. safeguarded customer fiat and crypto assets;
4. corporate assets, liabilities, revenue, and expenses;
5. ENK ecosystem treasury and token-allocation records;
6. collateral, margin, and settlement liquidity;
7. merchant payable/receivable and payment settlement;
8. custody positions and off-balance-sheet ownership records where applicable;
9. tokenized-asset issuer, investor, cash, settlement, and corporate-action records.

No automated netting or transfer between books is permitted merely because the same group controls them.

## 3. Core identifiers

Every financial event carries:

```text
event_id
event_version
idempotency_key
correlation_id
causation_id
legal_entity_id
product_id
activity_id
asset_id
network_id
jurisdiction_entitlement_id + version
customer_or_counterparty_id
order_id
bank_or_chain_reference
effective_at
recorded_at
value_date
amount_decimal
base_units
currency
debit_account
credit_account
status
evidence_hashes
```

Amounts use exact-decimal strings at API boundaries and fixed-precision decimal/numeric storage. IEEE-754 binary floating point is prohibited for ledger, reserve, supply, fee, rate, and reconciliation calculations.

## 4. Illustrative chart of accounts

Account names and classification require external accounting and legal approval before production.

| Code | Account | Normal balance | Book |
| --- | --- | --- | --- |
| 1100 | Reserve cash — segregated | Debit | TVKUSD reserve |
| 1110 | Eligible short-term reserve assets | Debit | TVKUSD reserve |
| 1120 | Reserve interest receivable | Debit | TVKUSD reserve / issuer according to policy |
| 1190 | Reserve settlement receivable | Debit | TVKUSD reserve |
| 2100 | TVKUSD redeemable liability | Credit | TVKUSD liability |
| 2110 | Mint orders pending delivery | Credit | TVKUSD liability |
| 2120 | Redemption payable | Credit | TVKUSD liability |
| 2190 | Suspense — unresolved TVKUSD outcome | Credit/debit; zero target | Controlled suspense |
| 3100 | ENK ecosystem treasury memorandum/equity classification | Policy-defined | ENK treasury only |
| 4100 | Issuer/service fee revenue | Credit | Corporate |
| 5100 | Banking, custody, audit, network and settlement expense | Debit | Corporate |
| 1200/2200 | Safeguarded customer asset / matching customer liability | Debit/Credit | Customer safeguarding |
| 1300/2300 | Collateral asset / collateral obligation | Debit/Credit | Collateral and settlement |

Reserve assets and TVKUSD liabilities may not be offset in reporting unless an applicable accounting standard and legal right require or permit it.

## 5. Journal lifecycle

Exact entries depend on the final legal/accounting model. The following are control patterns, not final accounting advice.

### 5.1 Fiat received for issuance

After bank finality and eligibility:

```text
Dr  Reserve cash — segregated
Cr  Mint orders pending delivery / TVKUSD liability control
```

No mint proposal exists before this entry and reserve classification pass.

### 5.2 TVKUSD mint confirmed and delivered

Reclassify the pending obligation into the redeemable TVKUSD liability, linking the exact chain transaction, supply delta, recipient, and mint authorisation.

```text
Dr  Mint orders pending delivery
Cr  TVKUSD redeemable liability
```

If accounting policy recognises the liability earlier, use control/memo accounts rather than duplicating the liability. The configured journal must be approved before use.

### 5.3 Redemption token locked/burned

After eligibility and final burn/lock evidence:

```text
Dr  TVKUSD redeemable liability
Cr  Redemption payable
```

### 5.4 Fiat redemption settled

```text
Dr  Redemption payable
Cr  Reserve cash — segregated
```

### 5.5 Fees

Fees are not deducted from reserve backing or recorded as reserve value without an approved basis. Customer fee, network fee, conversion spread, issuer fee, and third-party fee are separate line items and accounts.

## 6. Supply and reserve reconciliations

At minimum, calculate:

```text
onchain_total_supply
ledger_issued_supply
tvkusd_redeemable_liability_units
eligible_reserve_market_value
eligible_reserve_liquid_value
pending_mints
pending_redemptions
encumbered_reserve
unsettled_bank_items
unsettled_chain_items
```

Core assertions:

```text
onchain_total_supply = ledger_issued_supply
ledger_issued_supply = redeemable_liability_units
eligible_reserve_value >= redeemable_liability + required_buffer
reserve_accounts = custodian_or_bank_confirmed_positions
all subledger balances = control_account balances
```

Every assertion has an approved tolerance. Supply-unit tolerance should normally be zero. Valuation and settlement tolerances require documented justification, ownership, expiry, and escalation.

## 7. Reconciliation frequencies

| Reconciliation | Minimum design frequency |
| --- | --- |
| Mint/redemption order to ledger to chain | Event-time plus continuous exception monitoring |
| Total supply to issued liability | Each block/finality window and daily close |
| Reserve bank/custodian balances to ledger | Intraday where supported and daily close |
| Customer subledger to control accounts | Continuous and daily close |
| Payments/merchant settlement | Per settlement batch and daily close |
| Exchange/custody positions | Continuous/risk-based and daily close |
| Published reserve/attestation view | According to law and approved policy; source data reconciled first |

## 8. Unknown outcomes and suspense

Bank, chain, bridge, exchange, card, and payment-provider calls can time out after the external effect occurs. A timeout is not a failure.

Rules:

- write the intended operation and idempotency key before the external request;
- preserve immutable attempt and response evidence;
- move ambiguous results to `UNKNOWN_OUTCOME`;
- block automatic retry until independent reconciliation resolves the effect;
- use suspense accounts only with owner, reason, timestamp, supporting evidence, ageing, limit, and resolution deadline;
- never plug an unexplained difference by minting, burning, transferring reserves, or changing a prior journal;
- corrections use reversal/adjustment entries with complete audit lineage.

## 9. Close and attestation package

The daily close package includes:

- reserve and liability trial balances;
- supply reconciliation by contract/network;
- mint/redemption roll-forward;
- reserve composition, maturity, liquidity, counterparty and encumbrance;
- pending and unknown outcomes;
- suspense ageing;
- customer/control-account reconciliation;
- settlement, fee and revenue reconciliation;
- limit breaches, exceptions, incidents and approvals;
- data-source timestamps and completeness;
- canonical evidence hash and authorised sign-off.

External attestation data must derive from the closed and approved package, not directly from a marketing database or blockchain RPC.

## 10. Treasury and stress calculations

EnteleTREASURY consumes approved ledger positions and produces forecasts; it does not rewrite historical ledger facts.

Minimum scenarios:

- normal redemption curve;
- concentrated holder redemption;
- 10%, 25%, 50%, and severe run scenarios over defined horizons;
- bank/custodian outage or failure;
- reserve-asset price/liquidity haircut;
- chain congestion, reorganisation, pause, bridge or RPC outage;
- sanctions/asset freeze and legal hold;
- cyber/signing incident;
- stablecoin depeg and secondary-market dislocation.

Outputs include liquid reserve coverage, time-to-cash, funding gap, counterparty concentration, maximum executable redemption, and required management actions. Scenario assumptions remain editable, sourced, versioned, and outside formulas.

## 11. Audit and immutability

- append-only financial event history;
- deterministic journal rules with versioned configurations;
- unique idempotency keys and database constraints;
- immutable links between source event, decision, entitlement, journal, chain/bank reference, reconciliation, and correction;
- least-privilege, separation of duties, dual/quorum approval, and break-glass evidence;
- no editing/deletion of posted financial history;
- privacy-minimised identifiers and access logs;
- reproducible reports from frozen versions and source snapshots.

## 12. Activation gates

Production remains disabled until external accounting policy approval, legal entity/perimeter decisions, licensed issuer or partner scope, reserve/safeguarding arrangements, bank/custodian integrations, double-entry and exact-decimal tests, migration controls, reconciliations, security assessment, operational close, stress tests, audit evidence, and independent production approval are complete.

