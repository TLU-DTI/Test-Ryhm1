using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{
    public GameObject riskArea;
    public GameObject actionArea;
    public Button nextTurnButton;
    public NextTurn nextTurnManager;

    // Risk cards
    public RiskCard[] riskCards;
    public List<int> currentRiskCards;

    // Action cards
    public MitigationCard[] actionCards;
    public List<int> currentActionCards;
    public List<int> actionCardsInHand;

    // Selected cards
    public RiskCard selectedRiskCard;
    public MitigationCard selectedActionCard;

    // Card counts
    public int riskCardsOnField = 2;
    public int actionCardsOnField = 3;

    private Dictionary<int, MitigationCard> mitigationCardDictionary = new Dictionary<int, MitigationCard>();

    void Start()
    {
        nextTurnButton.onClick.AddListener(OnNextTurnButtonClick);
        InitializeCurrentRiskCards();
        InitializeCurrentActionCards();
        PlaceCardsOnField();
    }

    void InitializeCurrentRiskCards()
    {
        // Initialize all risk cards initially
        currentRiskCards = Enumerable.Range(0, riskCards.Length).ToList();
    }

    void InitializeCurrentActionCards()
    {
        // Initialize action cards in hand randomly
        currentActionCards = GetShuffledCardIndexes(actionCards.Length);
        actionCardsInHand = currentActionCards.Take(actionCardsOnField).ToList();
    }

    List<int> GetShuffledCardIndexes(int count)
    {
        List<int> indexes = Enumerable.Range(0, count).ToList();
        ShuffleList(indexes);
        return indexes;
    }

    void ShuffleList<T>(List<T> list)
    {
        System.Random rng = new System.Random();
        int n = list.Count;
        while (n > 1)
        {
            n--;
            int k = rng.Next(n + 1);
            T value = list[k];
            list[k] = list[n];
            list[n] = value;
        }
    }

    public void ClearAndPositionNewCards()
    {
        ClearCards();
        GenerateRandomRiskIndexes();
        ReplaceUsedActionCards();
        PlaceCardsOnField();
    }

    void ReplaceUsedActionCards()
    {
        // Track IDs of action cards that were used (deleted) this turn
        List<int> usedActionCardIDs = GetUsedActionCardIDs();

        // Determine remaining cards in hand (excluding used ones)
        List<int> remainingActionCards = actionCardsInHand.Where(id => !usedActionCardIDs.Contains(id)).ToList();

        // Replace used cards with new random cards, if needed
        while (remainingActionCards.Count < actionCardsOnField)
        {
            int randomCardID = GetRandomActionCardID();
            if (!remainingActionCards.Contains(randomCardID))
            {
                remainingActionCards.Add(randomCardID);
            }
        }

        // Update actionCardsInHand with the new set of cards
        actionCardsInHand = remainingActionCards.Take(actionCardsOnField).ToList();
    }

    private List<int> GetUsedActionCardIDs()
    {
        List<int> usedCardIDs = new List<int>();
        foreach (Transform child in actionArea.transform)
        {
            MitigationCard card = child.GetComponent<MitigationCard>();
            if (card != null)
            {
                usedCardIDs.Add(card.ID);
            }
        }
        return usedCardIDs;
    }

    private int GetRandomActionCardID()
    {
        List<int> availableCards = currentActionCards.Except(actionCardsInHand).ToList();
        if (availableCards.Count > 0)
        {
            int randomIndex = UnityEngine.Random.Range(0, availableCards.Count);
            return availableCards[randomIndex];
        }
        else
        {
            Debug.LogWarning("No available action cards left.");
            return -1; // Handle this case as per your game's logic
        }
    }

    public void GenerateRandomRiskIndexes()
    {
        // Generate new random risk cards each turn without repetition
        currentRiskCards = GetShuffledCardIndexes(riskCards.Length).Take(riskCardsOnField).ToList();
    }

    public void OnNextTurnButtonClick()
    {
        if (nextTurnButton.interactable)
        {
            ClearAndPositionNewCards();
        }
    }

    public void PlaceCardsOnField()
    {
        // Place risk cards
        float riskAreaWidth = riskArea.GetComponent<RectTransform>().rect.width;
        float riskCardSpacing = Mathf.Min(riskAreaWidth / riskCardsOnField, riskCards[0].GetComponent<RectTransform>().rect.width);
        float riskStartX = -(riskCardSpacing * (riskCardsOnField - 1)) / 2;

        for (int i = 0; i < riskCardsOnField; i++)
        {
            int cardIndex = currentRiskCards[i];
            float RxPos = riskStartX + i * riskCardSpacing;
            RiskCard riskCard = Instantiate(riskCards[cardIndex], riskArea.transform);
            riskCard.GetComponent<RectTransform>().anchoredPosition = new Vector2(RxPos, 0);
        }

        // Place action cards
        float actionAreaWidth = actionArea.GetComponent<RectTransform>().rect.width;
        float actionCardSpacing = Mathf.Min(actionAreaWidth / actionCardsOnField, actionCards[0].GetComponent<RectTransform>().rect.width);
        float actionStartX = -(actionCardSpacing * (actionCardsOnField - 1)) / 2;

        for (int i = 0; i < actionCardsOnField; i++)
        {
            int cardIndex = actionCardsInHand[i];
            float AxPos = actionStartX + i * actionCardSpacing;
            MitigationCard actionCardInstance = Instantiate(actionCards[cardIndex], actionArea.transform).GetComponent<MitigationCard>();
            RectTransform cardTransform = actionCardInstance.GetComponent<RectTransform>();
            cardTransform.anchoredPosition = new Vector2(AxPos, 0);
            actionCardInstance.ID = cardIndex;
            actionCardInstance.gameObject.SetActive(true);
        }
    }

    public void ClearCards()
    {
        foreach (Transform child in riskArea.transform)
        {
            Destroy(child.gameObject);
        }
        foreach (Transform child in actionArea.transform)
        {
            Destroy(child.gameObject);
        }
    }
}
