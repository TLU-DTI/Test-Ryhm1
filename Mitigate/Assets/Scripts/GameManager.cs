using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{
    public GameObject riskArea;
    public GameObject actionArea;
    public Button nextTurnButton;
    public NextTurn nextTurnManager;

    private SceneLoader sceneLoader;

    // Risk cards
    public RiskCard[] riskCards;
    public List<int> currentRiskCards;
    public List<int> startPool;
    public List<int> endPool;
    public List<int> riskCardsInPlay;

    // Action cards
    public MitigationCard[] actionCards;
    public List<int> currentActionCards;
    public List<int> actionCardsInHand;

    // Selected cards
    public RiskCard selectedRiskCard;
    public MitigationCard selectedActionCard;

    // Card counts
    public int riskCardsOnField = 1;
    public int actionCardsOnField = 2;

    public int round = 0;
    public int maxRounds = 12;
    public bool lost = false;

    public int scope = 50;
    public int quality = 50;
    public int time = 50;
    public int money = 50;

    int delayScope;
    int delayQuality;
    int delayTime;
    int delayMoney;

    public int difficulty = 0;

    public TextMeshProUGUI scopeText;
    public TextMeshProUGUI qualityText;
    public TextMeshProUGUI timeText;
    public TextMeshProUGUI moneyText;
    public TextMeshProUGUI roundText;

    public GameObject gameOverUI;
    
    public bool isValidDrop = false;

    public string GameScene { get; private set; }

    void Start()
    {
        GameScene = "GameScene";
        sceneLoader = FindObjectOfType<SceneLoader>();
        gameOverUI.SetActive(false);
        InitializeCards();
        actionCardsInHand = new List<int>();
        for (int i = 0; i < 6; i++)
        {
            actionCardsInHand.Add(-1);
        }
        riskCardsInPlay = new List<int>();
        for (int i = 0; i < 5; i++)
        {
            riskCardsInPlay.Add(-1);
        }
        RoundUpdater();
        generateRiskCards();
        generateActionCards();
        PlaceCardsOnField();
        UpdateStatTexts();
    }

    public void Update()
    {
        if (round > maxRounds && lost == false)
        {
            round = 12;
            EndGame();
        }

        if (lost == true)
        {
            EndGame();
        }

        if (round > 12)
        {
            round = 12;
            UpdateStatTexts();
        }

        if (scope < 25 || quality < 25 || time < 25 || money < 25)
        {
            lost = true;
        }
    }

    public void BackToMainMenu()
    {
        sceneLoader.LoadScene("MainMenu");
    }

    public void EndGame()
    {
        UpdateStatTexts();
        ClearCardsAfterTurn();
        gameOverUI.SetActive(true);
    }

    public void RoundUpdater()
    {
        
        round += 1;
        roundText.text = "Round: " + round;
        if (round >= 4 && round < 7)
        {
            riskCardsOnField = 2;
            actionCardsOnField = 3;
            
        } else if (round >= 7 && round < 9)
        {
            riskCardsOnField = 3;
            actionCardsOnField = 4;
        } else if (round >= 10 && round < 12)
        {
            riskCardsOnField = 4;
            actionCardsOnField = 5;
        } else if (round >= 12)
        {
            riskCardsOnField = 5;
            actionCardsOnField = 6;
        }
    }

    public void DIfficultyUpdater()
    {
        if (round == 10)
        {
            for (int i = 0; i < endPool.Count; i++)
            {
                currentRiskCards.Add(endPool[i]);
            }
        }
    }

    void UpdateStatTexts()
    {
        scope += delayScope;
        quality += delayQuality;
        time += delayTime;
        money += delayMoney;
        Debug.Log("Delay stats before: " + delayScope + ", " + delayQuality + ", " + delayTime + ", " + delayMoney);
        delayScope = 0;
        delayQuality = 0;
        delayTime = 0;
        delayMoney = 0;
        Debug.Log("Delay stats after: " + delayScope + ", " + delayQuality + ", " + delayTime + ", " + delayMoney);
        scopeText.text = "Scope: " + scope;
        qualityText.text = "Quality: " + quality;
        timeText.text = "Time: " + time;
        moneyText.text = "Money: " + money;
        Debug.Log("Stats are refreshed!");
    }

    public void NextTurn()
    {
        DIfficultyUpdater();
        RoundUpdater();
        ClearCardsAfterTurn();
        generateRiskCards();
        generateActionCards();
        PlaceCardsOnField();
        UpdateStatTexts();
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

    public void AddStats(int sAdd, int qAdd, int tAdd, int mAdd)
    {
        scope += sAdd;
        quality += qAdd;
        time += tAdd;
        money += mAdd;
        Debug.Log("Stats updated. Scope: +" + sAdd + " Quality: +" + qAdd + " Time: +" + tAdd + " Money: +" + mAdd);
        UpdateStatTexts();
    }

    public (int delayScope, int delayQuality, int delayTime, int delayMoney) DelayedAddStats(int sAdd, int qAdd, int tAdd, int mAdd)
    {
        delayScope += sAdd;
        delayQuality += qAdd;
        delayTime += tAdd;
        delayMoney += mAdd;
        Debug.Log("Stats updated. Scope: +" + sAdd + " Quality: +" + qAdd + " Time: +" + tAdd + " Money: +" + mAdd);
        return (delayScope, delayQuality, delayTime, delayMoney);
    }

    void InitializeCards()
    {
        for (int i = 0; i < riskCards.Length - 3; i++)
        {
            startPool.Add(i);
        }
        for (int i = 58; i < riskCards.Length; i++)
        {
            endPool.Add(i);
        }
        for (int i = 0; i < actionCards.Length; i++)
        {
            currentActionCards.Add(i);
        }
        for (int i = 0; i < startPool.Count; i++)
        {
            currentRiskCards.Add(startPool[i]);
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
            Debug.LogError("currentActionCards is empty.");
        } else 
        {
            for (int i = 0; i < actionCardsOnField; i++)
            {   
                if (actionCardsInHand[i] == -1)
                {
                    if (currentActionCards.Count > 0)
                    {
                        int randomIndex = UnityEngine.Random.Range(0, currentActionCards.Count);
                        actionCardsInHand[i] = currentActionCards[randomIndex];
                        Debug.Log("Added " + currentActionCards[randomIndex] + " to actionCardsInHand[" + i + "] and removed it from currentActionCards[" + randomIndex + "]");
                        currentActionCards.Remove(actionCardsInHand[i]);
                    }
                    else
                    {
                        Debug.LogError("No more cards left in currentRiskCards.");
                    }   
                }
            }
        }
    }

    public void RestartScene()
    {
        sceneLoader.LoadScene("GameScene");
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
