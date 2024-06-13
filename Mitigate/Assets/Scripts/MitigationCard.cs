using UnityEngine;
using UnityEngine.EventSystems;

public class MitigationCard : MonoBehaviour, IPointerClickHandler
{
    public int ID;
    public int scope;
    public int quality;
    public int time;
    public int money;
    public bool selected = false;
    private GameManager gameManager;

    private void Start()
    {
        gameManager = FindObjectOfType<GameManager>();
    }

    public void ApplyMitigation()
    {
        if (gameManager.selectedRiskCard != null)
        {
            Debug.Log(gameManager.selectedRiskCard.name + " is mitigated."); // Output the name of the risk card
        }
        else
        {
            Debug.Log("No risk card selected.");
        }
    }

    public void Deletion()
    {
        //gameManager.RemoveMitigationCard(ID); // Remove the MitigationCard from the field
        Destroy(gameObject);
    }

    public void OnPointerClick(PointerEventData eventData)
    {
        if (gameManager != null)
        {
            //gameManager.SetSelectedActionCard(this);
        }
    }

    public void SelectCard()
    {
        selected = true;
    }
}
