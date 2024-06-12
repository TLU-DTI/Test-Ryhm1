using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{
    public GameObject riskArea;
    public GameObject actionArea;
    public Button nextTurnButton;
    public NextTurn nextTurnManager;
// ------------------------------------------
    public RiskCard[] riskCards;
    public List<int> currentRiskCards;
    public List<int> riskCardGraveyard;
    public List<int> selectedRiskCards;
    public int riskCardsOnField = 1;
// ------------------------------------------
    public MitigationCard[] actionCards;
    public List<int> currentActionCards;
    public List<int> actionCardGraveyard;
    public List<int> selectedActionCards;
    public int actionCardsOnField = 2;


    void Start()
    {
        nextTurnButton.interactable = false;
        nextTurnButton.onClick.AddListener(OnNextTurnButtonClick);

        InitializeCurrentRiskCards();
        InitializeCurrentActionCards();
        GenerateRandomIndexes();
        RemoveSelectedRiskCards();
        PlaceCardsOnField();
    }

    void InitializeCurrentRiskCards()
    {
        currentRiskCards = new List<int>();
        for (int i = 0; i < riskCards.Length; i++)
        {
            currentRiskCards.Add(i);
        }
    }

    void InitializeCurrentActionCards()
    {
        currentActionCards = new List<int>();
        for (int i = 0; i < actionCards.Length; i++)
        {
            currentActionCards.Add(i);
        }
    }

    void RemoveSelectedRiskCards()
    {
        foreach (int index in selectedRiskCards)
        {
            currentRiskCards.Remove(index);
        }
    }

    void RemoveSelectedActionCards()
    {
        foreach (int index in selectedActionCards)
        {
            currentActionCards.Remove(index);
        }
    }

    void Update()
    {
        CheckIfAllCardsMitigated();
    }

    public void ClearAndPositionNewCards()
    {
        ClearCards();
        GenerateRandomIndexes();
        RemoveSelectedRiskCards();
        PlaceCardsOnField();
    }

    public void GenerateRandomIndexes()
    {
        if (riskCardsOnField > currentRiskCards.Count)
        {
            throw new ArgumentException("Count cannot be greater than the number of elements in the list.");
        }

        List<int> randomIndexes = new List<int>(currentRiskCards);
        System.Random rng = new System.Random();

        int n = randomIndexes.Count;
        while (n > riskCardsOnField)
        {
            n--;
            int k = rng.Next(n + 1);
            int value = randomIndexes[k];
            randomIndexes[k] = randomIndexes[n];
            randomIndexes[n] = value;
        }

        selectedRiskCards = randomIndexes.GetRange(0, riskCardsOnField);
    }

    public List<int> GetRandomIndices()
    {
        return null;
    }

    public void ClearCards()
    {
        foreach (Transform child in riskArea.transform)
        {
            Destroy(child.gameObject);
        }
    }

    public void CheckIfAllCardsMitigated()
    {
        bool allMitigated = true;
        foreach (Transform child in riskArea.transform)
        {
            RiskCard riskCard = child.GetComponent<RiskCard>();
            if (riskCard != null && !riskCard.mitigated)
            {
                allMitigated = false;
                break;
            }
        }
        nextTurnButton.interactable = allMitigated;
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
        float areaWidth = riskArea.GetComponent<RectTransform>().rect.width;
        int cardCount = selectedRiskCards.Count;
        float cardSpacing = Mathf.Min(areaWidth / cardCount, riskCards[0].GetComponent<RectTransform>().rect.width);
        float startX = -(cardSpacing * (cardCount - 1)) / 2;

        for (int i = 0; i < cardCount; i++)
        {
            float xPos = startX + i * cardSpacing;
            RiskCard riskCard = Instantiate(riskCards[selectedRiskCards[i]], riskArea.transform);
            riskCard.GetComponent<RectTransform>().anchoredPosition = new Vector2(xPos, 0);
        }
    }
}