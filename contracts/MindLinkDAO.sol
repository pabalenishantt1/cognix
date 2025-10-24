// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title MindLinkDAO - Simple open DAO (1 wallet = 1 vote, 24h default)
contract MindLinkDAO {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 createdAt;
        uint256 endAt;
    }

    Proposal[] public proposals;
    // tracks if an address has voted on a proposal: proposalId => voter => voted
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed id, address indexed creator, uint256 endAt);
    event Voted(uint256 indexed id, address indexed voter, bool support);

    uint256 public constant VOTING_DURATION = 24 hours;

    /// @notice create a new proposal (any wallet)
    function createProposal(string calldata title, string calldata description) external {
        uint256 id = proposals.length;
        uint256 created = block.timestamp;
        uint256 endAt = created + VOTING_DURATION;

        proposals.push(Proposal({
            id: id,
            title: title,
            description: description,
            creator: msg.sender,
            yesVotes: 0,
            noVotes: 0,
            createdAt: created,
            endAt: endAt
        }));

        emit ProposalCreated(id, msg.sender, endAt);
    }

    /// @notice vote yes for a proposal (only once per wallet)
    function voteYes(uint256 proposalId) external {
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal storage p = proposals[proposalId];
        require(block.timestamp <= p.endAt, "Voting closed");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        hasVoted[proposalId][msg.sender] = true;
        p.yesVotes += 1;

        emit Voted(proposalId, msg.sender, true);
    }

    /// @notice vote no for a proposal (only once per wallet)
    function voteNo(uint256 proposalId) external {
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal storage p = proposals[proposalId];
        require(block.timestamp <= p.endAt, "Voting closed");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        hasVoted[proposalId][msg.sender] = true;
        p.noVotes += 1;

        emit Voted(proposalId, msg.sender, false);
    }

    /// @notice returns total proposals count
    function proposalsCount() external view returns (uint256) {
        return proposals.length;
    }

    /// @notice returns a single proposal
    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        address creator,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 createdAt,
        uint256 endAt
    ) {
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal storage p = proposals[proposalId];
        return (p.id, p.title, p.description, p.creator, p.yesVotes, p.noVotes, p.createdAt, p.endAt);
    }
}
