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
    public List<int?> riskCardsInPlay;

    // Action cards
    public MitigationCard[] actionCards;
    public List<int> currentActionCards;
    public List<int?> actionCardsInHand;

    // Selected cards
    public RiskCard selectedRiskCard;
    public MitigationCard selectedActionCard;

    // Card counts
    public int riskCardsOnField = 2;
    public int actionCardsOnField = 3;
    
    public bool isValidDrop = false;

    void Start()
    {
        InitializeCards();
        actionCardsInHand = new List<int?>();
        for (int i = 0; i < actionCardsOnField; i++)
        {
            actionCardsInHand.Add(null);
        }
        riskCardsInPlay = new List<int?>();
        for (int i = 0; i < riskCardsOnField; i++)
        {
            riskCardsInPlay.Add(null);
        }
        generateRiskCards();
        generateActionCards();
        PlaceCardsOnField();
    }

    public void NextTurn()
    {
        ClearCardsAfterTurn();
        generateRiskCards();
        generateActionCards();
        PlaceCardsOnField();
    }

    public void SetSelectedRiskCard(RiskCard card)
    {
        if (selectedRiskCard != null && selectedRiskCard != card)
        {
            selectedRiskCard.selected = false;
            selectedRiskCard.UpdateSize();
            selectedRiskCard = card;
            selectedRiskCard.Select();
            
        } else if (selectedRiskCard != null && selectedRiskCard == card)
        {
            selectedRiskCard.selected = false;
            selectedRiskCard.UpdateSize();
            selectedRiskCard = null;
        } else 
        {
            selectedRiskCard = card;
            selectedRiskCard.Select();
        }
        
    }

    public void SetSelectedActionCard(MitigationCard card)
    {
        if (selectedActionCard != null && selectedActionCard != card)
        {
            selectedActionCard.selected = false;
            selectedActionCard.UpdateSize();
            selectedActionCard = card;
            selectedActionCard.Select();
        } else if (selectedActionCard != null && selectedActionCard == card)
        {
            selectedActionCard.selected = false;
            selectedActionCard.UpdateSize();
            selectedActionCard = null;
        } else
        {
            selectedActionCard = card;
            selectedActionCard.Select();
        }
        
    }
    void InitializeCards()
    {
        for (int i = 0; i < riskCards.Length; i++)
        {
            currentRiskCards.Add(i);
        }
        for (int i = 0; i < actionCards.Length; i++)
        {
            currentActionCards.Add(i);
        }
    }

    public void generateRiskCards()
    {
        if (currentRiskCards.Count == 0)
        {
            Debug.LogError("currentRiskCards is empty.");
        } else 
        {
            for (int i = 0; i < riskCardsOnField; i++)
            {
                int randomIndex = UnityEngine.Random.Range(0, currentRiskCards.Count);
                riskCardsInPlay[i] = currentRiskCards[randomIndex];
                currentRiskCards.Remove((int)riskCardsInPlay[i]);
            }
        }
    }

    public void generateActionCards()
    {
        if (currentActionCards.Count == 0)
        {
            Debug.LogError("currentRiskCards is empty.");
        } else 
        {
            for (int i = 0; i < actionCardsOnField; i++)
            {   
                if (actionCardsInHand[i] == null)
                {
                    if (currentActionCards.Count > 0)
                    {
                        int randomIndex = UnityEngine.Random.Range(0, currentActionCards.Count);
                        actionCardsInHand[i] = currentActionCards[randomIndex];
                        currentActionCards.Remove(randomIndex);
                    }
                    else
                    {
                        Debug.LogError("No more cards left in currentRiskCards.");
                    }   
                }
            }
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
            int cardIndex = (int)riskCardsInPlay[i];
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
            int cardIndex = (int)actionCardsInHand[i];
            float AxPos = actionStartX + i * actionCardSpacing;
            MitigationCard actionCard = Instantiate(actionCards[cardIndex], actionArea.transform).GetComponent<MitigationCard>();
            actionCard.GetComponent<RectTransform>().anchoredPosition = new Vector2(AxPos, 0);
            actionCard.ID = i;
        }
    }

    public void ClearCardsAfterTurn()
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
